import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.content}>

          <div style={styles.headingSection}>
            <div style={styles.icon}>👑</div>

            <h1 style={styles.title}>
              King's Kitchen
            </h1>

            <p style={styles.subtitle}>
              Admin Management Dashboard
            </p>

            <div style={styles.line}></div>
          </div>

          <div style={styles.cardContainer}>

            {/* MENU */}
            <Link
              to="/admin/menu"
              style={styles.card}
            >
              <div style={styles.cardIcon}>
                🍽️
              </div>

              <div style={styles.cardTitle}>
                Manage Menu
              </div>

              <div style={styles.cardText}>
                Add, edit, delete and manage
                restaurant menu items.
              </div>

              <div style={styles.cardButton}>
                Open Menu →
              </div>
            </Link>

            {/* RESERVATIONS */}
            <Link
              to="/admin/reservation"
              style={styles.card}
            >
              <div style={styles.cardIcon}>
                📅
              </div>

              <div style={styles.cardTitle}>
                Manage Reservations
              </div>

              <div style={styles.cardText}>
                Review bookings, update
                reservations and manage status.
              </div>

              <div style={styles.cardButton}>
                View Reservations →
              </div>
            </Link>

            {/* USERS */}
            <Link
              to="/admin/users"
              style={styles.card}
            >
              <div style={styles.cardIcon}>
                👥
              </div>

              <div style={styles.cardTitle}>
                Manage Users
              </div>

              <div style={styles.cardText}>
                Search users, check account
                status and manage access.
              </div>

              <div style={styles.cardButton}>
                Manage Users →
              </div>
            </Link>

          </div>

          <div style={styles.footerText}>
            King's Kitchen Administration Panel
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 80px)",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },

  overlay: {
    minHeight: "calc(100vh - 80px)",
    background:
      "linear-gradient(rgba(0,0,0,0.78), rgba(0,0,0,0.92))",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 30px",
    boxSizing: "border-box",
  },

  content: {
    width: "100%",
    maxWidth: "1150px",
    textAlign: "center",
  },

  headingSection: {
    marginBottom: "45px",
  },

  icon: {
    fontSize: "48px",
    marginBottom: "10px",
  },

  title: {
    margin: "0",
    color: "#D4AF37",
    fontSize: "44px",
    fontWeight: "700",
    letterSpacing: "1px",
    fontFamily: "Georgia, serif",
  },

  subtitle: {
    marginTop: "10px",
    color: "#ddd",
    fontSize: "18px",
  },

  line: {
    width: "90px",
    height: "3px",
    background: "#D4AF37",
    margin: "20px auto 0",
    borderRadius: "10px",
  },

  cardContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
  },

  card: {
    display: "block",
    textDecoration: "none",
    background:
      "linear-gradient(145deg, #202020, #151515)",
    border:
      "1px solid rgba(212,175,55,0.25)",
    borderRadius: "16px",
    padding: "35px 28px",
    minHeight: "280px",
    boxSizing: "border-box",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },

  cardIcon: {
    fontSize: "44px",
    marginBottom: "18px",
  },

  cardTitle: {
    color: "#D4AF37",
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "14px",
  },

  cardText: {
    color: "#bdbdbd",
    lineHeight: "1.6",
    fontSize: "15px",
    minHeight: "72px",
  },

  cardButton: {
    display: "inline-block",
    marginTop: "20px",
    padding: "11px 18px",
    borderRadius: "7px",
    background: "#8B0000",
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
  },

  footerText: {
    marginTop: "45px",
    color: "#777",
    fontSize: "13px",
  },
};

export default Dashboard;