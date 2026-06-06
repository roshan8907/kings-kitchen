import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

function MyReservations() {
  const [bookings, setBookings] = useState([]);

  const [editingId, setEditingId] = useState(null);
const [editData, setEditData] = useState({});

const handleUpdate = async (id) => {
  try {
    const ref = doc(db, "reservations", id);

    await updateDoc(ref, {
      date: editData.date,
      time: editData.time,
      guests: editData.guests,
    });

    // update UI instantly
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, ...editData } : b
      )
    );

    setEditingId(null);
    alert("Updated successfully!");
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const data = await getDocs(collection(db, "reservations"));

      const filtered = data.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.userId === user.uid);

      setBookings(filtered);
    };

    fetchData();
  }, []);

  return (
  <div style={{ padding: 20, background: "#111", color: "white", minHeight: "100vh" }}>
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

      marginBottom: 10,

      borderRadius: 8,

    }}

  >

    <p>Name: {b.fullName}</p>

    <p>Date: {b.date}</p>

    <p>Time: {b.time}</p>

    <p>Status: {b.status}</p>

    {/* ✏️ EDIT BUTTON */}

    <button

      onClick={() => {

        setEditingId(b.id);

        setEditData(b);

      }}

      style={{

        marginTop: "10px",

        padding: "6px 10px",

        background: "blue",

        color: "white",

        border: "none",

        borderRadius: "5px",

        cursor: "pointer",

      }}

    >

      Edit

    </button>

    {/* ✏️ EDIT FORM */}

    {editingId === b.id && (

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>

        

        <input

          value={editData.date || ""}

          onChange={(e) =>

            setEditData({ ...editData, date: e.target.value })

          }

          type="date"

        />

        <input

          value={editData.time || ""}

          onChange={(e) =>

            setEditData({ ...editData, time: e.target.value })

          }

          placeholder="Time"

        />

        <input

          value={editData.guests || ""}

          onChange={(e) =>

            setEditData({ ...editData, guests: e.target.value })

          }

          placeholder="Guests"

        />

        <button onClick={() => handleUpdate(b.id)}>

          Save

        </button>

        <button onClick={() => setEditingId(null)}>

          Cancel

        </button>

      </div>

    )}

    {/* 🍔 FOOD ITEMS */}

    {b.orderItems && b.orderItems.length > 0 && (

      <div style={{ marginTop: "10px" }}>

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