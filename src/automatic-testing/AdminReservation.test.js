import {
    render,
    screen,
    fireEvent,
  } from "@testing-library/react";
  
  import AdminReservation from "../pages/AdminReservation";
  
  const mockReservations = [
    {
      id: "1",
      fullName: "John Smith",
      email: "john@example.com",
      status: "pending",
    },
    {
      id: "2",
      fullName: "Sarah Brown",
      email: "sarah@example.com",
      status: "confirmed",
    },
    {
      id: "3",
      fullName: "Michael Lee",
      email: "michael@example.com",
      status: "cancelled",
    },
  ];
  
  jest.mock("../firebase", () => ({
    db: {},
  }));
  
  jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    getDocs: jest.fn(),
    updateDoc: jest.fn(),
    doc: jest.fn(),
    deleteDoc: jest.fn(),
  }));
  
  import { collection, getDocs } from "firebase/firestore";
  
  beforeEach(() => {
    collection.mockReturnValue({});
  
    getDocs.mockResolvedValue({
      docs: mockReservations.map((reservation) => ({
        id: reservation.id,
        data: () => reservation,
      })),
    });
  });
  
  test("searches reservations by customer name", async () => {
    render(<AdminReservation />);
  
    await screen.findByText("John Smith");
  
    const searchInput = screen.getByPlaceholderText(
      "Search by customer name or email..."
    );
  
    fireEvent.change(searchInput, {
      target: { value: "Sarah" },
    });
  
    expect(
      screen.getByText("Sarah Brown")
    ).toBeInTheDocument();
  
    expect(
      screen.queryByText("John Smith")
    ).not.toBeInTheDocument();
  });
  
  test("searches reservations by customer email", async () => {
    render(<AdminReservation />);
  
    await screen.findByText("John Smith");
  
    const searchInput = screen.getByPlaceholderText(
      "Search by customer name or email..."
    );
  
    fireEvent.change(searchInput, {
      target: { value: "michael@example.com" },
    });
  
    expect(
      screen.getByText("Michael Lee")
    ).toBeInTheDocument();
  
    expect(
      screen.queryByText("John Smith")
    ).not.toBeInTheDocument();
  });
  
  test("filters reservations by pending status", async () => {
    render(<AdminReservation />);
  
    await screen.findByText("John Smith");
  
    const statusFilter =
      screen.getByDisplayValue("All Reservations");
  
    fireEvent.change(statusFilter, {
      target: { value: "pending" },
    });
  
    expect(
      screen.getByText("John Smith")
    ).toBeInTheDocument();
  
    expect(
      screen.queryByText("Sarah Brown")
    ).not.toBeInTheDocument();
  
    expect(
      screen.queryByText("Michael Lee")
    ).not.toBeInTheDocument();
  });
  
  test("filters reservations by confirmed status", async () => {
    render(<AdminReservation />);
  
    await screen.findByText("John Smith");
  
    const statusFilter =
      screen.getByDisplayValue("All Reservations");
  
    fireEvent.change(statusFilter, {
      target: { value: "confirmed" },
    });
  
    expect(
      screen.getByText("Sarah Brown")
    ).toBeInTheDocument();
  
    expect(
      screen.queryByText("John Smith")
    ).not.toBeInTheDocument();
  
    expect(
      screen.queryByText("Michael Lee")
    ).not.toBeInTheDocument();
  });
  
  test("combines reservation search and status filtering", async () => {
    render(<AdminReservation />);
  
    await screen.findByText("John Smith");
  
    const searchInput = screen.getByPlaceholderText(
      "Search by customer name or email..."
    );
  
    const statusFilter =
      screen.getByDisplayValue("All Reservations");
  
    fireEvent.change(searchInput, {
      target: { value: "John" },
    });
  
    fireEvent.change(statusFilter, {
      target: { value: "pending" },
    });
  
    expect(
      screen.getByText("John Smith")
    ).toBeInTheDocument();
  
    expect(
      screen.queryByText("Sarah Brown")
    ).not.toBeInTheDocument();
  
    expect(
      screen.queryByText("Michael Lee")
    ).not.toBeInTheDocument();
  });