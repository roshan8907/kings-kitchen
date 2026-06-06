import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function UserMenu() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const menuRef = collection(db, "menu");

  // GET DATA
  const getMenu = async () => {
    const data = await getDocs(menuRef);

    const filtered = data.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .filter((item) => item.status === "Available");

    setItems(filtered);
  };

  useEffect(() => {
    getMenu();
  }, [getMenu]);

  const filteredItems = items.filter((item) => {
  return (
    (category === "All" || item.category === category) &&
    (item.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
});

  return (
    <div style={styles.page}>

     <h2 style={styles.title}>🍽 Menu of KingsKitchen</h2>

{/* SEARCH BAR */}
<input
  type="text"
  placeholder="Search food..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={styles.search}
/>

{/* CATEGORY BUTTONS */}
<div style={styles.buttonContainer}>

  {[
    "All",
    "Breakfast Food",
    "Lunch Food",
    "Dinner Food",
    "Main Meal",
    "Other",
  ].map((cat) => (

    <button
      key={cat}
      onClick={() => setCategory(cat)}
      style={{
        ...styles.categoryBtn,
        background:
          category === cat ? "#D4AF37" : "#222",
      }}
    >
      {cat}
    </button>

  ))}
</div>

      {/* GRID */}
      <div style={styles.grid}>
            {filteredItems.map((item) => (
            <div key={item.id} style={styles.card}>

            {/* IMAGE */}
            <div style={styles.imageBox}>
              <img src={item.image} alt={item.name} style={styles.image} />
            </div>

            {/* CONTENT */}
            <div style={styles.content}>
              <h3 style={styles.foodName}>{item.name}</h3>

              <p style={styles.desc}>
                {item.description}
              </p>

              <div style={styles.bottomRow}>
                <span style={styles.price}>₹{item.price}</span>
                <span style={styles.badge}>{item.category}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

const styles = {

  page: {
    padding: "20px",
    background: "#0f0f0f",
    minHeight: "100vh",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 3 per row
    gap: "20px",
  },

  card: {
    background: "#1a1a1a",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  },

  imageBox: {
    width: "100%",
    height: "160px",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  content: {
    padding: "12px",
  },

  foodName: {
    margin: "0",
    fontSize: "18px",
  },

  desc: {
    fontSize: "13px",
    color: "#aaa",
    marginTop: "5px",
    minHeight: "40px",
  },

  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },

  price: {
    color: "#D4AF37",
    fontWeight: "bold",
  },

  badge: {
    background: "#333",
    padding: "3px 8px",
    borderRadius: "5px",
    fontSize: "11px",
  },

  search: {
  width: "98.5%",
  padding: "12px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #333",
  background: "#1a1a1a",
  color: "white",
  fontSize: "15px",
},

buttonContainer: {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "25px",
},

categoryBtn: {
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
},
};

export default UserMenu;