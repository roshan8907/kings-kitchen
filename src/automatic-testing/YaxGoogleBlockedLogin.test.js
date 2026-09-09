import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import Login from "../pages/Login";

const mockNavigate = jest.fn();
const mockGoogleLogin = jest.fn();
const mockGetDoc = jest.fn();
const mockSignOut = jest.fn();
const mockAddDoc = jest.fn();

jest.mock(
  "react-router-dom",
  () => ({
    Link: ({ children }) => <span>{children}</span>,
    useNavigate: () => mockNavigate,
  }),
  { virtual: true }
);

jest.mock(
  "react-google-recaptcha",
  () => {
    const React = require("react");

    return React.forwardRef(
      ({ onChange }, ref) => {
        return React.createElement(
          "button",
          {
            type: "button",
            onClick: () =>
              onChange("test-captcha-token"),
          },
          "Complete CAPTCHA"
        );
      }
    );
  },
  { virtual: true }
);

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),

  sendPasswordResetEmail: jest.fn(),

  signInWithPopup: (...args) =>
    mockGoogleLogin(...args),

  signOut: (...args) =>
    mockSignOut(...args),
}));

jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(),

  doc: jest.fn(() => ({
    id: "blocked-user-123",
  })),

  getDoc: (...args) =>
    mockGetDoc(...args),

  addDoc: (...args) =>
    mockAddDoc(...args),

  collection: jest.fn(() => ({
    name: "securityLogs",
  })),

  serverTimestamp: jest.fn(() => "timestamp"),
}));

jest.mock("../firebase", () => ({
  auth: {},
  db: {},
  googleProvider: {},
}));

describe(
  "Yax - Blocked Google Account Login",
  () => {
    beforeEach(() => {
      jest.clearAllMocks();

      process.env.REACT_APP_RECAPTCHA_SITE_KEY =
        "test-site-key";

      window.alert = jest.fn();

      mockGoogleLogin.mockResolvedValue({
        user: {
          uid: "blocked-user-123",
          email: "blocked@gmail.com",
          displayName: "Blocked User",
        },
      });

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          status: "blocked",
          role: "user",
        }),
      });

      mockSignOut.mockResolvedValue();

      mockAddDoc.mockResolvedValue({
        id: "security-log-123",
      });
    });

    test(
      "YAX-37-01: blocked Google account cannot log in",
      async () => {
        render(<Login />);

        fireEvent.click(
          screen.getByRole("button", {
            name: "Complete CAPTCHA",
          })
        );

        const googleButton =
          screen.getByRole("button", {
            name: "Continue with Google",
          });

        fireEvent.click(googleButton);

        await waitFor(() => {
          expect(
            mockGoogleLogin
          ).toHaveBeenCalled();
        });

        expect(
          window.alert
        ).toHaveBeenCalledWith(
          "🚫 Your account is blocked by admin."
        );

        expect(
          mockSignOut
        ).toHaveBeenCalled();

        expect(
          mockNavigate
        ).not.toHaveBeenCalledWith("/");

        expect(
          mockNavigate
        ).not.toHaveBeenCalledWith(
          "/dashboard"
        );
      }
    );

    test(
      "YAX-37-02: blocked Google login is recorded as a security event",
      async () => {
        render(<Login />);

        fireEvent.click(
          screen.getByRole("button", {
            name: "Complete CAPTCHA",
          })
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Continue with Google",
          })
        );

        await waitFor(() => {
          expect(
            mockAddDoc
          ).toHaveBeenCalled();
        });

        expect(
          mockAddDoc.mock.calls[0][1]
        ).toEqual(
          expect.objectContaining({
            event:
              "BLOCKED_GOOGLE_LOGIN_ATTEMPT",
            email:
              "blocked@gmail.com",
            userId:
              "blocked-user-123",
          })
        );
      }
    );

    test(
      "YAX-37-03: blocked Google account is signed out",
      async () => {
        render(<Login />);

        fireEvent.click(
          screen.getByRole("button", {
            name: "Complete CAPTCHA",
          })
        );

        fireEvent.click(
          screen.getByRole("button", {
            name: "Continue with Google",
          })
        );

        await waitFor(() => {
          expect(
            mockSignOut
          ).toHaveBeenCalledTimes(1);
        });

        expect(
          mockNavigate
        ).not.toHaveBeenCalled();
      }
    );
  }
);