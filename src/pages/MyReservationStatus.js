import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

function MyReservations() {
  const [bookings, setBookings] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // NEW FEATURE: Reservation history filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // UPDATE RESERVATION
  const handleUpdate = async (id) => {
    try {
      const ref = doc(db, "reservations", id);

      await updateDoc(ref, {
        date: editData.date,
        time: editData.time,
        guests: editData.guests,
      });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, ...editData } : b
        )
      );

      setEditingId(null);
      alert("Reservation updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Unable to update reservation.");
    }
  };

  // CANCEL RESERVATION
  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const ref = doc(db, "reservations", id);

      await updateDoc(ref, {
        status: "Cancelled",
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );

      setEditingId(null);

      alert("Reservation cancelled successfully.");
    } catch (error) {
      console.error("Cancellation error:", error);
      alert("Unable to cancel reservation.");
    }
  };

  // GET CURRENT USER RESERVATIONS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          return;
        }

        const data = await getDocs(
          collection(db, "reservations")
        );

        const filtered = data.docs
          .map((reservationDoc) => ({
            id: reservationDoc.id,
            ...reservationDoc.data(),
          }))
          .filter((item) => item.userId === user.uid);

        setBookings(filtered);
      } catch (error) {
        console.error("Error loading reservations:", error);
      }
    };

    fetchData();
  }, []);

  // NEW FEATURE:
  // Search, filter and sort reservations
  const displayedBookings = bookings
    .filter((booking) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        (booking.fullName || "")
          .toLowerCase()
          .includes(search) ||
        (booking.date || "")
          .toLowerCase()
          .includes(search) ||
        (booking.time || "")
          .toLowerCase()
          .includes(search);

      const normalizedStatus = (
        booking.status || "pending"
      ).toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);

      if (sortOrder === "oldest") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortOrder("newest");
  };

  return (
    <div
      style={{
        padding: 20,
        background: "#111",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h2>My Reservation Status</h2>

      {/* NEW FEATURE: FILTER CONTROLS */}
      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search by name, date or time..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={styles.select}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value)
          }
          style={styles.select}
        >
          <option value="newest">
            Newest First
          </option>
          <option value="oldest">
            Oldest First
          </option>
        </select>

        <button
          onClick={clearFilters}
          style={styles.clearButton}
        >
          Clear
        </button>
      </div>

      <p style={styles.resultText}>
        Showing {displayedBookings.length} of{" "}
        {bookings.length} reservations
      </p>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : displayedBookings.length === 0 ? (
        <div style={styles.noResults}>
          No reservations match your search or filter.
        </div>
      ) : (
        displayedBookings.map((b) => (
          <div
            key={b.id}
            style={styles.card}
          >
            <p>
              <strong>Name:</strong>{" "}
              {b.fullName}
            </p>

            <p>
              <strong>Date:</strong> {b.date}
            </p>

            <p>
              <strong>Time:</strong> {b.time}
            </p>

            <p>
              <strong>Guests:</strong>{" "}
              {b.guests}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    b.status === "Cancelled" ||
                    b.status === "cancelled"
                      ? "#ff4d4d"
                      : "#D4AF37",
                  fontWeight: "bold",
                }}
              >
                {b.status}
              </span>
            </p>

            {/* EDIT BUTTON */}
            {b.status !== "Cancelled" &&
              b.status !== "cancelled" && (
                <button
                  onClick={() => {
                    setEditingId(b.id);
                    setEditData({
                      date: b.date || "",
                      time: b.time || "",
                      guests: b.guests || "",
                    });
                  }}
                  style={styles.editButton}
                >
                  Edit
                </button>
              )}

            {/* CANCEL BUTTON */}
            {b.status !== "Cancelled" &&
              b.status !== "cancelled" && (
                <button
                  onClick={() => handleCancel(b.id)}
                  style={styles.cancelButton}
                >
                  Cancel Reservation
                </button>
              )}

            {/* EDIT FORM */}
            {editingId === b.id && (
              <div style={styles.editForm}>
                <input
                  value={editData.date || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      date: e.target.value,
                    })
                  }
                  type="date"
                />

                <input
                  value={editData.time || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      time: e.target.value,
                    })
                  }
                  placeholder="Time"
                />

                <input
                  value={editData.guests || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      guests: e.target.value,
                    })
                  }
                  placeholder="Guests"
                />

                <button
                  onClick={() =>
                    handleUpdate(b.id)
                  }
                  style={styles.saveButton}
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  style={styles.closeButton}
                >
                  Close
                </button>
              </div>
            )}

            {/* FOOD ITEMS */}
            {b.orderItems &&
              b.orderItems.length > 0 && (
                <div style={{ marginTop: "15px" }}>
                  <h4>Food Items:</h4>

                  {b.orderItems.map(
                    (item, index) => (
                      <p key={index}>
                        🍔 {item.name} ×{" "}
                        {item.qty || 1} - $
                        {item.price}
                      </p>
                    )
                  )}
                </div>
              )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  filterContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  searchInput: {
    flex: 1,
    minWidth: "250px",
    padding: "10px",
    background: "#222",
    color: "white",
    border: "1px solid #444",
    borderRadius: "5px",
  },

  select: {
    padding: "10px",
    background: "#222",
    color: "white",
    border: "1px solid #444",
    borderRadius: "5px",
  },

  clearButton: {
    padding: "10px 15px",
    background: "#555",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  resultText: {
    color: "#aaa",
    marginBottom: "20px",
  },

  noResults: {
    background: "#222",
    padding: "30px",
    borderRadius: "8px",
    color: "#aaa",
    textAlign: "center",
  },

  card: {
    background: "#222",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
  },

  editButton: {
    marginTop: "10px",
    marginRight: "8px",
    padding: "8px 12px",
    background: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  cancelButton: {
    marginTop: "10px",
    padding: "8px 12px",
    background: "#8B0000",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  editForm: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  saveButton: {
    padding: "8px 12px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  closeButton: {
    padding: "8px 12px",
    background: "#555",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default MyReservations;