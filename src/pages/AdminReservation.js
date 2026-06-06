import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";

function AdminReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);


  const deleteReservation = async (id) => {
  try {
    const ref = doc(db, "reservations", id);
    await deleteDoc(ref);

    // remove from UI instantly
    setReservations((prev) => prev.filter((r) => r.id !== id));
  } catch (error) {
    console.error("Error deleting reservation:", error);
  }
};


  // FETCH RESERVATIONS
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const snapshot = await getDocs(collection(db, "reservations"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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

  // UPDATE STATUS (confirm / cancel / pending)
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
      console.error("Error updating status:", error);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#111", minHeight: "100vh", color: "white" }}>
      
      <h1 style={{ color: "#d4af37" }}>Admin Reservations</h1>

      {loading ? (
        <p>Loading...</p>
      ) : reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        reservations.map((r) => (
          <div
            key={r.id}
            style={{
              background: "#1e1e1e",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "1px solid #333",
            }}
          >
            <h2 style={{ color: "#d4af37" }}>{r.fullName}</h2>
            <p>Table No: {r.tableNo || "N/A"}</p>
            <p>Email: {r.email}</p>
            <p>Phone: {r.phone}</p>
            <p>Date: {r.date}</p>
            <p>Time: {r.time}</p>
            <p>Guests: {r.guests}</p>

            <p style={{ marginTop: "10px" }}>
              Status:{" "}
              <b style={{ color: r.status === "confirmed" ? "green" : r.status === "cancelled" ? "red" : "orange" }}>
                {r.status}
              </b>
            </p>

            {/* ORDER ITEMS */}
            <div style={{ marginTop: "10px" }}>
              <h4>Order Items:</h4>

              {r.orderItems && r.orderItems.length > 0 ? (
                r.orderItems.map((item, index) => (
                  <p key={index}>
                    🍔 {item.name} × {item.qty} - ${item.price}
                  </p>
                ))
              ) : (
                <p>No items ordered</p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => updateStatus(r.id, "confirmed")}
                style={{
                  padding: "8px 12px",
                  background: "green",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Confirm
              </button>

              <button
                onClick={() => updateStatus(r.id, "pending")}
                style={{
                  padding: "8px 12px",
                  background: "orange",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Pending
              </button>

              <button
                onClick={() => updateStatus(r.id, "cancelled")}
                style={{
                  padding: "8px 12px",
                  background: "red",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Cancel
              </button>

              <button
  onClick={() => deleteReservation(r.id)}
  style={{
    padding: "8px 12px",
    background: "#333333",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  }}
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

export default AdminReservation;