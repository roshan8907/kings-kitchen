import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

function AdminReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW FEATURE: Search and status filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // DELETE RESERVATION
  const deleteReservation = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reservation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const ref = doc(db, "reservations", id);
      await deleteDoc(ref);

      // Remove from UI instantly
      setReservations((prev) =>
        prev.filter((r) => r.id !== id)
      );
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Unable to delete reservation.");
    }
  };

  // FETCH RESERVATIONS
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "reservations")
        );

        const data = snapshot.docs.map((reservationDoc) => ({
          id: reservationDoc.id,
          ...reservationDoc.data(),
        }));

        setReservations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      const ref = doc(db, "reservations", id);

      await updateDoc(ref, { status });

      setReservations((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status } : r
        )
      );
    } catch (error) {
      console.error("Error updating reservation status:", error);
      alert("Unable to update reservation status.");
    }
  };

  // NEW FEATURE:
  // Filter reservations using search and status
  const filteredReservations = reservations.filter(
    (reservation) => {
      const name = (
        reservation.fullName || ""
      ).toLowerCase();

      const email = (
        reservation.email || ""
      ).toLowerCase();

      const search = searchTerm
        .toLowerCase()
        .trim();

      const matchesSearch =
        name.includes(search) ||
        email.includes(search);

      const normalizedStatus = (
        reservation.status || "pending"
      ).toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  return (
    <div
      style={{
        padding: "20px",
        background: "#111",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={styles.title}>
        Admin Reservations
      </h1>

      {/* NEW FEATURE: SEARCH + STATUS FILTER */}
      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search by customer name or email..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={styles.searchInput}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={styles.statusSelect}
        >
          <option value="all">
            All Reservations
          </option>
          <option value="pending">
            Pending
          </option>
          <option value="confirmed">
            Confirmed
          </option>
          <option value="cancelled">
            Cancelled
          </option>
        </select>

        <button
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
          }}
          style={styles.clearButton}
        >
          Clear
        </button>
      </div>

      <p style={styles.resultText}>
        Showing {filteredReservations.length} of{" "}
        {reservations.length} reservations
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : filteredReservations.length === 0 ? (
        <div style={styles.noResults}>
          No reservations match your search or filter.
        </div>
      ) : (
        filteredReservations.map((r) => (
          <div
            key={r.id}
            style={styles.reservationCard}
          >
            <h2 style={styles.customerName}>
              {r.fullName}
            </h2>

            <p>
              <strong>Table No:</strong>{" "}
              {r.tableNo || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {r.email || "N/A"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {r.phone || "N/A"}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {r.date || "N/A"}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {r.time || "N/A"}
            </p>

            <p>
              <strong>Guests:</strong>{" "}
              {r.guests || "N/A"}
            </p>

            <p style={{ marginTop: "10px" }}>
              <strong>Status:</strong>{" "}
              <b
                style={{
                  color:
                    r.status === "confirmed"
                      ? "green"
                      : r.status === "cancelled" ||
                        r.status === "Cancelled"
                      ? "red"
                      : "orange",
                }}
              >
                {r.status}
              </b>
            </p>

            {/* ORDER ITEMS */}
            <div style={{ marginTop: "10px" }}>
              <h4>Order Items:</h4>

              {r.orderItems &&
              r.orderItems.length > 0 ? (
                r.orderItems.map((item, index) => (
                  <p key={index}>
                    🍔 {item.name} ×{" "}
                    {item.qty || 1} - $
                    {item.price}
                  </p>
                ))
              ) : (
                <p>No items ordered</p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() =>
                  updateStatus(
                    r.id,
                    "confirmed"
                  )
                }
                style={styles.confirmButton}
              >
                Confirm
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    r.id,
                    "pending"
                  )
                }
                style={styles.pendingButton}
              >
                Pending
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    r.id,
                    "cancelled"
                  )
                }
                style={styles.cancelButton}
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  deleteReservation(r.id)
                }
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  title: {
    color: "#d4af37",
    marginBottom: "20px",
  },

  filterContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  searchInput: {
    flex: 1,
    minWidth: "280px",
    padding: "10px",
    background: "#222",
    color: "white",
    border: "1px solid #444",
    borderRadius: "5px",
  },

  statusSelect: {
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
    background: "#1e1e1e",
    padding: "30px",
    borderRadius: "10px",
    color: "#aaa",
    textAlign: "center",
  },

  reservationCard: {
    background: "#1e1e1e",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #333",
  },

  customerName: {
    color: "#d4af37",
  },

  confirmButton: {
    padding: "8px 12px",
    background: "green",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },

  pendingButton: {
    padding: "8px 12px",
    background: "orange",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },

  cancelButton: {
    padding: "8px 12px",
    background: "red",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },

  deleteButton: {
    padding: "8px 12px",
    background: "#333333",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default AdminReservation;