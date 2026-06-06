import { Link } from "react-router-dom";
function Dashboard() {

  return (
    <div style={styles.hero}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={styles.cardContainer}>
          <Link to="/admin/menu" style={styles.card}>
            🍽 Manage Menu
          </Link>
          <Link to="/admin/reservation" style={styles.card}>
            📅 Manage Reservations
          </Link>

        <Link to="/admin/users" style={styles.card}>
            👥 Manage User 
          </Link>
        </div>
      </div>
    </div>
  );
}
const styles = {

  hero: {
    height: "85vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  title: {
    color: "#D4AF37",
    marginBottom: "50px",
    fontSize: "42px",
    fontFamily: "Playfair Display, serif",
  },

  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },

  card: {
    width: "250px",
    padding: "40px",
    backgroundColor: "#8B0000",
    color: "white",
    textDecoration: "none",
    borderRadius: "10px",
    fontSize: "20px",
    fontWeight: "bold",
    transition: "0.3s",
  },
};

export default Dashboard;