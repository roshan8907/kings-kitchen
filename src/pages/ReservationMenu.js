import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

function ReservationMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const table = params.get("table");

  const reservationData = location.state;

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);

  // SECURITY / DESIGN CHECK
  useEffect(() => {
    if (!reservationData) {
      alert(
        "Please complete your reservation details first."
      );

      navigate("/reservation");
    }
  }, [reservationData, navigate]);

  // GET AVAILABLE MENU
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const snap = await getDocs(
          collection(db, "menu")
        );

        const data = snap.docs
          .map((menuDoc) => ({
            id: menuDoc.id,
            ...menuDoc.data(),
          }))
          .filter(
            (item) => item.status === "Available"
          );

        setItems(data);
      } catch (error) {
        console.error(
          "Error loading menu:",
          error
        );
      }
    };

    fetchMenu();
  }, []);

  // SELECT / UNSELECT FOOD
  const toggleItem = (item) => {
    setSelected((prev) => {
      const exists = prev.find(
        (i) => i.id === item.id
      );

      if (exists) {
        return prev.filter(
          (i) => i.id !== item.id
        );
      }

      return [
        ...prev,
        {
          ...item,
          qty: 1,
        },
      ];
    });
  };

  // INCREASE QUANTITY
  const increaseQty = (id) => {
    setSelected((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item
      )
    );
  };

  // DECREASE QUANTITY
  const decreaseQty = (id) => {
    setSelected((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1
          ? {
              ...item,
              qty: item.qty - 1,
            }
          : item
      )
    );
  };

  // CONFIRM RESERVATION
  const finalSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    // SECURITY CHECK
    if (!user) {
      alert(
        "Please login before confirming your reservation."
      );

      navigate("/login");
      return;
    }

    // SECURITY / WORKFLOW CHECK
    if (!reservationData) {
      alert(
        "Reservation details are missing. Please start again."
      );

      navigate("/reservation");
      return;
    }

    if (
      !reservationData.fullName ||
      !reservationData.date ||
      !reservationData.time ||
      !reservationData.guests
    ) {
      alert(
        "Please complete all reservation details before continuing."
      );

      navigate("/reservation");
      return;
    }

    try {
      const booking = {
        ...reservationData,
        userId: user.uid,
        tableNo: table || "",
        orderItems: selected,
        status: "pending",
        createdAt: new Date(),
      };

      await addDoc(
        collection(db, "reservations"),
        booking
      );

      alert("Booking Confirmed!");

      navigate("/my-reservations");
    } catch (error) {
      console.error(
        "Reservation error:",
        error
      );

      alert(
        "Unable to complete the reservation."
      );
    }
  };

  // Prevent rendering invalid workflow
  if (!reservationData) {
    return null;
  }

  return (
    <div
      style={{
        padding: 20,
        background: "#111",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h2>Select Food</h2>

      <p>
        Name: {reservationData.fullName}
      </p>

      {table && (
        <h3
          style={{
            color: "#D4AF37",
          }}
        >
          Table No: {table}
        </h3>
      )}

      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {items.map((item) => {
          const selectedItem = selected.find(
            (i) => i.id === item.id
          );

          return (
            <div
              key={item.id}
              style={{
                width: 200,
                background: "#222",
                padding: 10,
                borderRadius: 8,
              }}
            >
              <img
                src={
                  item.image ||
                  "https://via.placeholder.com/200"
                }
                alt={item.name}
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                }}
              />

              <h4>{item.name}</h4>

              <p>
                {item.description}
              </p>

              <p>
                ${item.price}
              </p>

              <label>
                <input
                  type="checkbox"
                  checked={selectedItem !== undefined}
                  onChange={() =>
                    toggleItem(item)
                  }
                />{" "}
                Select
              </label>

              {selectedItem && (
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <button
                    onClick={() =>
                      decreaseQty(item.id)
                    }
                  >
                    -
                  </button>

                  <span
                    style={{
                      margin: "0 10px",
                    }}
                  >
                    {selectedItem.qty}
                  </span>

                  <button
                    onClick={() =>
                      increaseQty(item.id)
                    }
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={finalSubmit}
        style={{
          marginTop: 20,
          padding: 15,
          background: "#D4AF37",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Confirm Reservation
      </button>
    </div>
  );
}

export default ReservationMenu;