import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import Login from "../pages/Login";

const mockNavigate = jest.fn();
const mockSignIn = jest.fn();
const mockGetDoc = jest.fn();
const mockAddDoc = jest.fn();
const mockSignOut = jest.fn();

jest.mock(
  "react-router-dom",
  () => ({
    Link: ({ children }) => children,
    useNavigate: () => mockNavigate,
  }),
  { virtual: true }
);

jest.mock(
  "react-google-recaptcha",
  () => {
    const mockReact = require("react");

    return mockReact.forwardRef(
      ({ onChange, onExpired, onErrored }, ref) => {
        return mockReact.createElement(
          "div",
          null,

          mockReact.createElement(
            "button",
            {
              type: "button",
              onClick: () =>
                onChange("test-captcha-token"),
            },
            "Complete CAPTCHA"
          ),

          mockReact.createElement(
            "button",
            {
              type: "button",
              onClick: onExpired,
            },
            "Expire CAPTCHA"
          ),

          mockReact.createElement(
            "button",
            {
              type: "button",
              onClick: onErrored,
            },
            "CAPTCHA Error"
          )
        );
      }
    );
  },
  { virtual: true }
);

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: (...args) =>
    mockSignIn(...args),

  sendPasswordResetEmail: jest.fn(),

  signInWithPopup: jest.fn(),

  signOut: (...args) =>
    mockSignOut(...args),
}));

jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(),

  doc: jest.fn(() => ({
    id: "test-user-123",
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

describe("Muskan - Login CAPTCHA Feature", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.REACT_APP_RECAPTCHA_SITE_KEY =
      "test-site-key";

    window.alert = jest.fn();

    mockSignIn.mockResolvedValue({
      user: {
        uid: "test-user-123",
        email: "muskan@test.com",
      },
    });

    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        status: "active",
        role: "user",
      }),
    });

    mockAddDoc.mockResolvedValue({
      id: "security-log-1",
    });

    mockSignOut.mockResolvedValue();
  });

  const enterLoginDetails = () => {
    fireEvent.change(
      screen.getByPlaceholderText("Enter Email"),
      {
        target: {
          value: "muskan@test.com",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Password"),
      {
        target: {
          value: "Password1",
        },
      }
    );
  };

  test(
    "CAPTCHA-01: login is disabled before CAPTCHA is completed",
    () => {
      render(<Login />);

      enterLoginDetails();

      const loginButton = screen.getByRole(
        "button",
        {
          name: "Login",
        }
      );

      expect(loginButton).toBeDisabled();

      expect(
        mockSignIn
      ).not.toHaveBeenCalled();
    }
  );

  test(
    "CAPTCHA-02: completing CAPTCHA enables login",
    async () => {
      render(<Login />);

      enterLoginDetails();

      fireEvent.click(
        screen.getByRole("button", {
          name: "Complete CAPTCHA",
        })
      );

      const loginButton = screen.getByRole(
        "button",
        {
          name: "Login",
        }
      );

      expect(loginButton).not.toBeDisabled();

      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(
          mockSignIn
        ).toHaveBeenCalledWith(
          {},
          "muskan@test.com",
          "Password1"
        );
      });

      expect(
        mockNavigate
      ).toHaveBeenCalledWith("/");
    }
  );

  test(
    "CAPTCHA-03: expired CAPTCHA disables login",
    () => {
      render(<Login />);

      enterLoginDetails();

      fireEvent.click(
        screen.getByRole("button", {
          name: "Complete CAPTCHA",
        })
      );

      const loginButton = screen.getByRole(
        "button",
        {
          name: "Login",
        }
      );

      expect(loginButton).not.toBeDisabled();

      fireEvent.click(
        screen.getByRole("button", {
          name: "Expire CAPTCHA",
        })
      );

      expect(loginButton).toBeDisabled();

      expect(
        mockSignIn
      ).not.toHaveBeenCalled();
    }
  );

  test(
    "CAPTCHA-04: CAPTCHA error clears CAPTCHA",
    () => {
      render(<Login />);

      enterLoginDetails();

      fireEvent.click(
        screen.getByRole("button", {
          name: "Complete CAPTCHA",
        })
      );

      const loginButton = screen.getByRole(
        "button",
        {
          name: "Login",
        }
      );

      expect(loginButton).not.toBeDisabled();

      fireEvent.click(
        screen.getByRole("button", {
          name: "CAPTCHA Error",
        })
      );

      expect(window.alert).toHaveBeenCalledWith(
        "CAPTCHA could not be loaded. Please try again."
      );

      expect(loginButton).toBeDisabled();

      expect(
        mockSignIn
      ).not.toHaveBeenCalled();
    }
  );
});