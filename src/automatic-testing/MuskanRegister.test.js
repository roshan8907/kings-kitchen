import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import Register from "../pages/Register";

const mockNavigate = jest.fn();
const mockCreateUser = jest.fn();
const mockSetDoc = jest.fn();

jest.mock(
  "react-router-dom",
  () => ({
    Link: ({ children }) => <span>{children}</span>,
    useNavigate: () => mockNavigate,
  }),
  { virtual: true }
);

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: (...args) =>
    mockCreateUser(...args),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: (...args) => mockSetDoc(...args),
}));

jest.mock("../firebase", () => ({
  auth: {},
  db: {},
}));

describe("Muskan - Register Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.alert = jest.fn();

    mockCreateUser.mockResolvedValue({
      user: {
        uid: "test-user-123",
      },
    });

    mockSetDoc.mockResolvedValue();
  });

  const fillForm = ({
    fullName = "Muskan",
    email = "muskan@test.com",
    password = "Password1",
    confirmPassword = "Password1",
  } = {}) => {
    fireEvent.change(
      screen.getByPlaceholderText("Enter Full Name"),
      {
        target: { value: fullName },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Email"),
      {
        target: { value: email },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Password"),
      {
        target: { value: password },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Confirm Password"),
      {
        target: { value: confirmPassword },
      }
    );
  };

  test("REG-01: rejects empty full name", async () => {
    render(<Register />);

    fillForm({
      fullName: "",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      })
    );

    expect(
      await screen.findByText(
        "Please enter your full name."
      )
    ).toBeInTheDocument();

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test("REG-02: rejects password shorter than 8 characters", async () => {
    render(<Register />);

    fillForm({
      password: "Pass1",
      confirmPassword: "Pass1",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      })
    );

    expect(
      await screen.findByText(
        "Password must be at least 8 characters long."
      )
    ).toBeInTheDocument();

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test("REG-03: rejects password without uppercase letter", async () => {
    render(<Register />);

    fillForm({
      password: "password1",
      confirmPassword: "password1",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      })
    );

    expect(
      await screen.findByText(
        "Password must contain at least one uppercase letter."
      )
    ).toBeInTheDocument();

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test("REG-04: rejects password without a number", async () => {
    render(<Register />);

    fillForm({
      password: "Password",
      confirmPassword: "Password",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      })
    );

    expect(
      await screen.findByText(
        "Password must contain at least one number."
      )
    ).toBeInTheDocument();

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test("REG-05: rejects mismatched passwords", async () => {
    render(<Register />);

    fillForm({
      password: "Password1",
      confirmPassword: "Password2",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      })
    );

    expect(
      await screen.findByText(
        "Passwords do not match."
      )
    ).toBeInTheDocument();

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test("REG-06: creates account when valid information is entered", async () => {
    render(<Register />);

    fillForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      })
    );

    await waitFor(() => {
      expect(
        mockCreateUser
      ).toHaveBeenCalledWith(
        {},
        "muskan@test.com",
        "Password1"
      );
    });

    expect(mockSetDoc).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      "User Created Successfully"
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/login"
    );
  });
});