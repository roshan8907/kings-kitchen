import { render, screen, fireEvent } from "@testing-library/react";
import AdminUsers from "../pages/AdminUsers";

const mockUsers = [
  {
    id: "1",
    fullName: "John Smith",
    email: "john@example.com",
    role: "user",
    status: "active",
  },
  {
    id: "2",
    fullName: "Sarah Brown",
    email: "sarah@example.com",
    role: "user",
    status: "blocked",
  },
  {
    id: "3",
    fullName: "Michael Lee",
    email: "michael@example.com",
    role: "user",
    status: "active",
  },
];

jest.mock("../firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

import { collection, getDocs } from "firebase/firestore";

beforeEach(() => {
  collection.mockReturnValue({});
  getDocs.mockResolvedValue({
    docs: mockUsers.map((user) => ({
      id: user.id,
      data: () => user,
    })),
  });
});

test("searches users by name", async () => {
  render(<AdminUsers />);

  await screen.findByText("John Smith");

  const searchInput = screen.getByPlaceholderText(
    "Search by name or email..."
  );

  fireEvent.change(searchInput, {
    target: { value: "Sarah" },
  });

  expect(screen.getByText("Sarah Brown")).toBeInTheDocument();
  expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
});

test("searches users by email", async () => {
  render(<AdminUsers />);

  await screen.findByText("John Smith");

  const searchInput = screen.getByPlaceholderText(
    "Search by name or email..."
  );

  fireEvent.change(searchInput, {
    target: { value: "michael@example.com" },
  });

  expect(screen.getByText("Michael Lee")).toBeInTheDocument();
  expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
});

test("filters users by active status", async () => {
  render(<AdminUsers />);

  await screen.findByText("John Smith");

  const statusFilter = screen.getByDisplayValue("All Users");

  fireEvent.change(statusFilter, {
    target: { value: "active" },
  });

  expect(screen.getByText("John Smith")).toBeInTheDocument();
  expect(screen.getByText("Michael Lee")).toBeInTheDocument();
  expect(screen.queryByText("Sarah Brown")).not.toBeInTheDocument();
});

test("filters users by blocked status", async () => {
  render(<AdminUsers />);

  await screen.findByText("John Smith");

  const statusFilter = screen.getByDisplayValue("All Users");

  fireEvent.change(statusFilter, {
    target: { value: "blocked" },
  });

  expect(screen.getByText("Sarah Brown")).toBeInTheDocument();
  expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
  expect(screen.queryByText("Michael Lee")).not.toBeInTheDocument();
});

test("combines search and status filtering", async () => {
  render(<AdminUsers />);

  await screen.findByText("John Smith");

  const searchInput = screen.getByPlaceholderText(
    "Search by name or email..."
  );

  const statusFilter = screen.getByDisplayValue("All Users");

  fireEvent.change(searchInput, {
    target: { value: "John" },
  });

  fireEvent.change(statusFilter, {
    target: { value: "active" },
  });

  expect(screen.getByText("John Smith")).toBeInTheDocument();
  expect(screen.queryByText("Sarah Brown")).not.toBeInTheDocument();
  expect(screen.queryByText("Michael Lee")).not.toBeInTheDocument();
});