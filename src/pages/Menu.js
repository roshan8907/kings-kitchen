

import React from "react";

function Menu() {
  
  const menuItems = [
    {
      id: 1,
      name: "Grilled Steak",
      description: "Juicy premium steak cooked to perfection.",
      price: "$32",
      category: "Main Course",
      image: "/images/steak.jpg",
    },
    {
      id: 2,
      name: "Classic Burger",
      description: "Beef burger with cheese and fresh vegetables.",
      price: "$18",
      category: "Burgers",
      image: "/images/burger.jpg",
    },
    {
      id: 3,
      name: "Creamy Pasta",
      description: "Creamy garlic pasta with parmesan cheese.",
      price: "$24",
      category: "Pasta",
      image: "/images/pasta.jpg",
    },
    {
      id: 4,
      name: "Caesar Salad",
      description: "Fresh salad with crispy croutons and dressing.",
      price: "$15",
      category: "Salads",
      image: "/images/salad.jpg",
    },
    {
      id: 5,
      name: "Seafood Pizza",
      description: "Fresh seafood pizza with mozzarella cheese.",
      price: "$28",
      category: "Pizza",
      image: "/images/pizza.jpg",
    },
    {
      id: 6,
      name: "Chocolate Cake",
      description: "Rich chocolate dessert with soft cream.",
      price: "$12",
      category: "Dessert",
      image: "/images/cake.jpg",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#111",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {}
      <div
        style={{
          height: "40vh",
          backgroundImage: "url('/images/menu-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              color: "#d4af37",
              marginBottom: "10px",
            }}
          >
            Our Menu
          </h1>

          <p
            style={{
              fontSize: "1.2rem",
              color: "white",
            }}
          >
            Enjoy our premium selection of dishes.
          </p>
        </div>
      </div>

      {}
      <div
        style={{
          padding: "60px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
        }}
      >
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #2c2c2c",
              transition: "0.3s",
            }}
          >
            {}
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
              }}
            />

            {}
            <div
              style={{
                padding: "20px",
              }}
            >
              <h2
                style={{
                  color: "#d4af37",
                  marginBottom: "10px",
                }}
              >
                {item.name}
              </h2>

              <span
                style={{
                  color: "#999",
                  fontSize: "0.9rem",
                }}
              >
                {item.category}
              </span>

              <p
                style={{
                  color: "#ddd",
                  marginTop: "15px",
                  marginBottom: "20px",
                  lineHeight: "1.5",
                }}
              >
                {item.description}
              </p>

              {}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "#d4af37",
                    fontWeight: "bold",
                  }}
                >
                  {item.price}
                </span>

                <button
                  style={{
                    backgroundColor: "#b30000",
                    color: "white",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;