import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import MyReservations from "../pages/MyReservationStatus";

import * as firebaseAuth from "firebase/auth";
import * as firestore from "firebase/firestore";

jest.mock("../firebase", () => ({
  db: {},
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

describe("Roshan - Cancel Reservation", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    firebaseAuth.getAuth.mockReturnValue({});

    firebaseAuth.onAuthStateChanged.mockImplementation(
      (auth, callback) => {
        callback({
          uid: "test-user-123",
        });

        return () => {};
      }
    );

    firestore.collection.mockReturnValue("reservations");

    firestore.query.mockReturnValue("reservation-query");

    firestore.where.mockReturnValue("user-filter");

    firestore.getDocs.mockResolvedValue({
      docs: [
        {
          id: "reservation-1",
          data: () => ({
            userId: "test-user-123",
            fullName: "Michael Lee",
            date: "2026-09-15",
            time: "18:00",
            guests: "2",
            status: "Confirmed",
          }),
        },
      ],
    });

    firestore.doc.mockImplementation(
      (db, collectionName, id) => ({
        id,
      })
    );

    firestore.updateDoc.mockResolvedValue();

    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
  });

  test("CAN-01: cancels an existing reservation", async () => {
    render(<MyReservations />);

    expect(
      await screen.findByText("Michael Lee")
    ).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", {
      name: "Cancel Reservation",
    });

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        {
          id: "reservation-1",
        },
        {
          status: "Cancelled",
        }
      );
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Reservation cancelled successfully."
    );
  });

  test("CAN-02: cancellation is stopped when user selects No", async () => {
    window.confirm.mockReturnValue(false);

    render(<MyReservations />);

    expect(
      await screen.findByText("Michael Lee")
    ).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", {
      name: "Cancel Reservation",
    });

    fireEvent.click(cancelButton);

    expect(firestore.updateDoc).not.toHaveBeenCalled();
  });

  test("CAN-03: cancelled reservation does not show cancel button", async () => {
    firestore.getDocs.mockResolvedValue({
      docs: [
        {
          id: "reservation-2",
          data: () => ({
            userId: "test-user-123",
            fullName: "Michael Lee",
            date: "2026-09-15",
            time: "18:00",
            guests: "2",
            status: "Cancelled",
          }),
        },
      ],
    });

    render(<MyReservations />);

    expect(
      await screen.findByText("Cancelled")
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Cancel Reservation",
      })
    ).not.toBeInTheDocument();
  });

  test("CAN-04: cancelled reservation displays Cancelled status", async () => {
    firestore.getDocs.mockResolvedValue({
      docs: [
        {
          id: "reservation-3",
          data: () => ({
            userId: "test-user-123",
            fullName: "Michael Lee",
            date: "2026-09-15",
            time: "18:00",
            guests: "2",
            status: "Cancelled",
          }),
        },
      ],
    });

    render(<MyReservations />);

    expect(
      await screen.findByText("Cancelled")
    ).toBeInTheDocument();
  });
});