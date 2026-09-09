import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import Reservation from "../pages/Reservation";

const mockNavigate = jest.fn();
const mockAddDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockGetAuth = jest.fn();

let existingDocs = [];

jest.mock(
  "react-router-dom",
  () => ({
    useNavigate: () => mockNavigate,
  }),
  { virtual: true }
);

jest.mock("../firebase", () => ({
  db: {},
}));

jest.mock("firebase/auth", () => ({
  getAuth: () => mockGetAuth(),
}));

jest.mock("firebase/firestore", () => ({
  addDoc: (...args) => mockAddDoc(...args),

  collection: jest.fn(() => ({
    name: "reservations",
  })),

  query: jest.fn(() => ({
    mockedQuery: true,
  })),

  where: jest.fn(),

  getDocs: (...args) =>
    mockGetDocs(...args),
}));

describe(
  "Roshan - Duplicate Reservation Feature",
  () => {
    beforeEach(() => {
      jest.clearAllMocks();

      existingDocs = [];

      window.alert = jest.fn();

      mockGetAuth.mockReturnValue({
        currentUser: {
          uid: "test-user-123",
          email: "roshan@test.com",
        },
      });

      mockAddDoc.mockResolvedValue({
        id: "reservation-123",
      });

      mockGetDocs.mockResolvedValue({
        docs: existingDocs,
      });
    });

    const fillForm = (
      date = "2026-09-15",
      time = "6:00 PM"
    ) => {
      fireEvent.change(
        document.querySelector(
          'input[name="fullName"]'
        ),
        {
          target: {
            value: "Roshan Dhakal",
          },
        }
      );

      fireEvent.change(
        document.querySelector(
          'input[name="email"]'
        ),
        {
          target: {
            value: "roshan@test.com",
          },
        }
      );

      fireEvent.change(
        document.querySelector(
          'input[name="phone"]'
        ),
        {
          target: {
            value: "0212345678",
          },
        }
      );

      fireEvent.change(
        document.querySelector(
          'input[name="date"]'
        ),
        {
          target: {
            value: date,
          },
        }
      );

      fireEvent.change(
        document.querySelector(
          'select[name="time"]'
        ),
        {
          target: {
            value: time,
          },
        }
      );

      fireEvent.change(
        document.querySelector(
          'select[name="guests"]'
        ),
        {
          target: {
            value: "2 Guests",
          },
        }
      );

      fireEvent.change(
        document.querySelector(
          'textarea[name="request"]'
        ),
        {
          target: {
            value: "",
          },
        }
      );
    };

    test(
      "DUP-01: creates reservation when no duplicate exists",
      async () => {
        existingDocs = [];

        mockGetDocs.mockResolvedValue({
          docs: existingDocs,
        });

        render(<Reservation />);

        fillForm(
          "2026-09-16",
          "5:00 PM"
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Submit Reservation",
          })
        );

        await waitFor(() => {
          expect(
            mockAddDoc
          ).toHaveBeenCalledTimes(1);
        });

        expect(
          mockAddDoc.mock.calls[0][1]
        ).toEqual(
          expect.objectContaining({
            fullName: "Roshan Dhakal",
            date: "2026-09-16",
            time: "5:00 PM",
            userId: "test-user-123",
            email: "roshan@test.com",
            status: "pending",
          })
        );
      }
    );

    test(
      "DUP-02: prevents duplicate reservation for same date and time",
      async () => {
        existingDocs = [
          {
            data: () => ({
              date: "2026-09-15",
              time: "6:00 PM",
              status: "pending",
            }),
          },
        ];

        mockGetDocs.mockResolvedValue({
          docs: existingDocs,
        });

        render(<Reservation />);

        fillForm(
          "2026-09-15",
          "6:00 PM"
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Submit Reservation",
          })
        );

        await waitFor(() => {
          expect(
            window.alert
          ).toHaveBeenCalledWith(
            "A reservation already exists for this date and time."
          );
        });

        expect(
          mockAddDoc
        ).not.toHaveBeenCalled();
      }
    );

    test(
      "DUP-03: allows reservation at a different time",
      async () => {
        existingDocs = [];

        mockGetDocs.mockResolvedValue({
          docs: existingDocs,
        });

        render(<Reservation />);

        fillForm(
          "2026-09-15",
          "7:00 PM"
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Submit Reservation",
          })
        );

        await waitFor(() => {
          expect(
            mockAddDoc
          ).toHaveBeenCalledTimes(1);
        });

        expect(
          mockAddDoc.mock.calls[0][1]
        ).toEqual(
          expect.objectContaining({
            date: "2026-09-15",
            time: "7:00 PM",
          })
        );
      }
    );

    test(
      "DUP-04: allows same date and time after cancellation",
      async () => {
        existingDocs = [
          {
            data: () => ({
              date: "2026-09-15",
              time: "6:00 PM",
              status: "Cancelled",
            }),
          },
        ];

        mockGetDocs.mockResolvedValue({
          docs: existingDocs,
        });

        render(<Reservation />);

        fillForm(
          "2026-09-15",
          "6:00 PM"
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Submit Reservation",
          })
        );

        await waitFor(() => {
          expect(
            mockAddDoc
          ).toHaveBeenCalledTimes(1);
        });
      }
    );
  }
);