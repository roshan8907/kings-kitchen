import React from "react";
import {
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";

import ProtectedRoute from "../components/ProtectedRoute";

const mockGetAuth = jest.fn();
const mockOnAuthStateChanged = jest.fn();
const mockGetDoc = jest.fn();

let currentUser = null;
let userRole = "user";

jest.mock(
  "react-router-dom",
  () => ({
    Navigate: ({ to }) => (
      <div data-testid="redirect">
        Redirected to {to}
      </div>
    ),
  }),
  { virtual: true }
);

jest.mock("firebase/auth", () => ({
  getAuth: (...args) => mockGetAuth(...args),

  onAuthStateChanged: (...args) =>
    mockOnAuthStateChanged(...args),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(() => ({
    id: "user-document",
  })),

  getDoc: (...args) => mockGetDoc(...args),
}));

jest.mock("../firebase", () => ({
  db: {},
}));

describe("Yax - Admin Page Access Control", () => {
  beforeEach(() => {
    cleanup();

    jest.clearAllMocks();

    currentUser = null;
    userRole = "user";

    mockGetAuth.mockReturnValue({
      currentUser: null,
    });

    mockOnAuthStateChanged.mockImplementation(
      (auth, callback) => {
        callback(currentUser);

        return () => {};
      }
    );

    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        role: userRole,
      }),
    });
  });

  test(
    "YAX-36-01: normal user cannot access admin page",
    async () => {
      currentUser = {
        uid: "normal-user-123",
        email: "user@test.com",
      };

      userRole = "user";

      render(
        <ProtectedRoute adminOnly>
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("redirect")
        ).toBeInTheDocument();
      });

      expect(
        screen.getByTestId("redirect")
      ).toHaveTextContent(
        "Redirected to /"
      );

      expect(
        screen.queryByText("Admin Content")
      ).not.toBeInTheDocument();
    }
  );

  test(
    "YAX-36-02: administrator can access admin page",
    async () => {
      currentUser = {
        uid: "admin-user-123",
        email: "admin@test.com",
      };

      userRole = "admin";

      render(
        <ProtectedRoute adminOnly>
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Admin Content")
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText("Admin Content")
      ).toBeInTheDocument();

      expect(
        screen.queryByTestId("redirect")
      ).not.toBeInTheDocument();
    }
  );

  test(
    "YAX-36-03: unauthenticated user is redirected to login",
    async () => {
      currentUser = null;

      render(
        <ProtectedRoute adminOnly>
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("redirect")
        ).toBeInTheDocument();
      });

      expect(
        screen.getByTestId("redirect")
      ).toHaveTextContent(
        "Redirected to /login"
      );

      expect(
        screen.queryByText("Admin Content")
      ).not.toBeInTheDocument();
    }
  );
});