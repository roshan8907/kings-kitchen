import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const snap = await getDocs(collection(db, "menu"));

        const data = snap.docs.map((menuDoc) => ({
          id: menuDoc.id,
          ...menuDoc.data(),
        }));

        setItems(data);
      } catch (error) {
        console.error("Error loading menu:", error);
        alert("Unable to load menu.");
      }
    };

    fetchMenu();
  }, []);

  const toggleItem = (item) => {
    setSelected((prev) => {
      const exists = prev.find((i) => i.id === item.id);

      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  const increaseQty = (id) => {
    setSelected((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: item.qty + 1 }
          : item
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
    if (isSubmitting) {
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!reservationData) {
      alert("Reservation information is missing.");
      navigate("/reservation");
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * NEW FEATURE:
       * Prevent the same user from creating
       * multiple reservations for the same
       * date and time.
       */
      const reservationsRef = collection(db, "reservations");

      const duplicateQuery = query(
        reservationsRef,
        where("userId", "==", user.uid),
        where("date", "==", reservationData.date),
        where("time", "==", reservationData.time)
      );

      const duplicateSnapshot = await getDocs(duplicateQuery);

      const activeDuplicate = duplicateSnapshot.docs.some(
        (reservationDoc) => {
          const data = reservationDoc.data();

          return data.status !== "Cancelled";
        }
      );

      if (activeDuplicate) {
        alert(
          "You already have a reservation for this date and time."
        );

        setIsSubmitting(false);
        return;
      }

      const booking = {
        ...reservationData,
        userId: user.uid,
        tableNo: table,
        orderItems: selected,
        status: "pending",
        createdAt: new Date(),
      };

      await addDoc(reservationsRef, booking);

      alert("Booking Confirmed!");

      navigate("/my-reservations");
    } catch (error) {
      console.error("Reservation error:", error);
      alert("Unable to confirm reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      <h2>Select Food</h2>

      <p>
        Name: {reservationData?.fullName}
      </p>

      {table && (
        <h3 style={{ color: "#D4AF37" }}>
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
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              width: 200,
              background: "#222",
              padding: 10,
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: 120,
                objectFit: "cover",
              }}
            />

            <h4>{item.name}</h4>

            <label>
              <input
                type="checkbox"
                checked={selected.some(
                  (i) => i.id === item.id
                )}
                onChange={() => toggleItem(item)}
              />{" "}
              Select
            </label>

            {selected.some(
              (i) => i.id === item.id
            ) && (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() =>
                    decreaseQty(item.id)
                  }
                  type="button"
                >
                  -
                </button>

                <span
                  style={{
                    margin: "0 10px",
                  }}
                >
                  {
                    selected.find(
                      (i) => i.id === item.id
                    )?.qty
                  }
                </span>

                <button
                  onClick={() =>
                    increaseQty(item.id)
                  }
                  type="button"
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={finalSubmit}
        disabled={isSubmitting}
        style={{
          marginTop: 20,
          padding: 15,
          opacity: isSubmitting ? 0.6 : 1,
          cursor: isSubmitting
            ? "not-allowed"
            : "pointer",
        }}
      >
        {isSubmitting
          ? "Confirming..."
          : "Confirm Reservation"}
      </button>
    </div>
  );
}

export default ReservationMenu;