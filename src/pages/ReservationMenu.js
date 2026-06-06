import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function ReservationMenu() {
  const location = useLocation();
  const navigate = useNavigate();

const params = new URLSearchParams(location.search);
const table = params.get("table");

  const reservationData = location.state;

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const snap = await getDocs(collection(db, "menu"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setItems(data);
    };

    fetchMenu();
  }, []);

const toggleItem = (item) => {
  setSelected((prev) => {
    const exists = prev.find((i) => i.id === item.id);

    if (exists) {
      return prev.filter((i) => i.id !== item.id);
    } else {
      return [...prev, { ...item, qty: 1 }];
    }
  });
};

const increaseQty = (id) => {
  setSelected((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    )
  );
};

const decreaseQty = (id) => {
  setSelected((prev) =>
    prev.map((item) =>
      item.id === id && item.qty > 1
        ? { ...item, qty: item.qty - 1 }
        : item
    )
  );
};

const finalSubmit = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const booking = {
  ...reservationData,
  userId: user.uid,
  tableNo: table,
  orderItems: selected,
  status: "pending",
  createdAt: new Date(),
};

  await addDoc(collection(db, "reservations"), booking);

  alert("Booking Confirmed!");
  navigate("/my-reservations");
};

  return (
    <div style={{ padding: 20, background: "#111", color: "white" }}>
      <h2>Select Food</h2>

      <p>Name: {reservationData?.fullName}</p>

      {table && (
  <h3 style={{ color: "#D4AF37" }}>
    Table No: {table}
  </h3>
)}

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {items.map((item) => (
          <div key={item.id} style={{ width: 200, background: "#222", padding: 10 }}>
            <img src={item.image} style={{ width: "100%", height: 120 }} />
            <h4>{item.name}</h4>

            <label>
              <input
                type="checkbox"
                checked={selected.some((i) => i.id === item.id)}
                onChange={() => toggleItem(item)}
              />
              Select
            </label>

            
  {selected.some((i) => i.id === item.id) && (
    <div style={{ marginTop: "10px" }}>
      <button onClick={() => decreaseQty(item.id)}>-</button>
      <span style={{ margin: "0 10px" }}>
        {selected.find((i) => i.id === item.id)?.qty}
      </span>
      <button onClick={() => increaseQty(item.id)}>+</button>
    </div>
  )}

          </div>
        ))}
      </div>

      <button onClick={finalSubmit} style={{ marginTop: 20, padding: 15 }}>
        Confirm Reservation
      </button>

    </div>
  );
}

export default ReservationMenu;