import React, { useState } from "react";

function Reservation() {
  const [reservation, setReservation] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    request: "",
  });

  const handleChange = (e) => {
    setReservation({
      ...reservation,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(reservation);

    alert("Reservation Submitted!");
  };

  return (
    <>
      {/* CSS INSIDE COMPONENT */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        .reservation-page {
          min-height: 100vh;
          background-image: url("https://images.unsplash.com/photo-1552566626-52f8b828add9");
          background-size: cover;
          background-position: center;
        }

        .reservation-overlay {
          background-color: rgba(0, 0, 0, 0.85);
          min-height: 100vh;
          padding: 50px;
        }

        .reservation-wrapper {
          max-width: 1200px;
          margin: auto;
          display: flex;
          gap: 50px;
          background-color: rgba(20, 20, 20, 0.95);
          border-radius: 15px;
          padding: 40px;
          box-shadow: 0px 0px 20px rgba(0,0,0,0.5);
        }

        .reservation-form-section {
          flex: 2;
        }

        .reservation-form-section h1 {
          color: #d4af37;
          font-size: 45px;
          margin-bottom: 10px;
        }

        .reservation-form-section p {
          color: white;
          margin-bottom: 35px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }

        .form-group label {
          color: #d4af37;
          margin-bottom: 8px;
          font-weight: bold;
        }

        input,
        select,
        textarea {
          padding: 14px;
          border: 1px solid #444;
          border-radius: 8px;
          background-color: #2c2c2c;
          color: white;
          font-size: 16px;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border: 1px solid #d4af37;
        }

        textarea {
          resize: none;
        }

        button {
          background-color: #b30000;
          color: white;
          border: none;
          padding: 15px;
          width: 100%;
          border-radius: 8px;
          font-size: 18px;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 10px;
        }

        button:hover {
          background-color: #d10000;
        }

        .reservation-info-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .reservation-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 12px;
        }

        .reservation-note {
          background-color: #1f1f1f;
          padding: 25px;
          border-radius: 12px;
          border-left: 5px solid #d4af37;
        }

        .reservation-note h3 {
          color: #d4af37;
          margin-bottom: 10px;
        }

        .reservation-note p {
          color: white;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .reservation-wrapper {
            flex-direction: column;
          }

          .reservation-form-section h1 {
            font-size: 35px;
          }
        }
      `}</style>

      <div className="reservation-page">
        <div className="reservation-overlay">

          <div className="reservation-wrapper">

            
            <div className="reservation-form-section">

              <h1>Book a Table</h1>

              <p>
                Fill in the details below to reserve your table.
              </p>

              <form onSubmit={handleSubmit}>

                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>

                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>

                  <select
                    name="time"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Time</option>
                    <option>5:00 PM</option>
                    <option>6:00 PM</option>
                    <option>7:00 PM</option>
                    <option>8:00 PM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Number of Guests</label>

                  <select
                    name="guests"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Guests</option>
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>5+ Guests</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Request (Optional)</label>

                  <textarea
                    name="request"
                    placeholder="Write your request..."
                    rows="5"
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit">
                  Submit Reservation
                </button>

              </form>
            </div>
            {/* RIGHT SIDE */}
            <div className="reservation-info-section">

              <div className="reservation-image">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                  alt="restaurant"
                />
              </div>

              <div className="reservation-note">
                <h3>Note</h3>

                <p>
                  Your reservation request will be confirmed
                  by our reception team.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default Reservation;