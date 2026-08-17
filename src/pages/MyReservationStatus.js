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

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            style={{
              background: "#222",
              padding: 15,
              marginBottom: 15,
              borderRadius: 8,
            }}
          >
            <p>
              <strong>Name:</strong> {b.fullName}
            </p>

            <p>
              <strong>Date:</strong> {b.date}
            </p>

            <p>
              <strong>Time:</strong> {b.time}
            </p>

            <p>
              <strong>Guests:</strong> {b.guests}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    b.status === "Cancelled"
                      ? "#ff4d4d"
                      : "#D4AF37",
                  fontWeight: "bold",
                }}
              >
                {b.status}
              </span>
            </p>

            {/* EDIT BUTTON */}
            {b.status !== "Cancelled" && (
              <button
                onClick={() => {
                  setEditingId(b.id);
                  setEditData({
                    date: b.date || "",
                    time: b.time || "",
                    guests: b.guests || "",
                  });
                }}
                style={{
                  marginTop: "10px",
                  marginRight: "8px",
                  padding: "8px 12px",
                  background: "blue",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            )}

            {/* CANCEL BUTTON */}
            {b.status !== "Cancelled" && (
              <button
                onClick={() => handleCancel(b.id)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  background: "#8B0000",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel Reservation
              </button>
            )}

            {/* EDIT FORM */}
            {editingId === b.id && (
              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
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
                  onClick={() => handleUpdate(b.id)}
                  style={{
                    padding: "6px 10px",
                    background: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  style={{
                    padding: "6px 10px",
                    background: "#555",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            )}

            {/* FOOD ITEMS */}
            {b.orderItems && b.orderItems.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <h4>Food Items:</h4>

                {b.orderItems.map((item, index) => (
                  <p key={index}>
                    🍔 {item.name} × {item.qty || 1} - ${item.price}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyReservations;