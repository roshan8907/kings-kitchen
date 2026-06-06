import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo1.png";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const isAdmin = user?.email === "admin@gmail.com";

  return (
    <>
      <nav style={styles.nav}>
        {/* LEFT */}
        
        <div style={styles.left}>
  <Link to="/" style={styles.logoLink}>
    <img src={logo} alt="logo" style={styles.logoImg} />
  </Link>

  <Link to="/" style={styles.logoLink}>
    <h2 style={styles.title}>The King's Kitchen</h2>
  </Link>
</div>

        {/* HAMBURGER (ONLY MOBILE) */}
        <div
          className="hamburger"
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* DESKTOP MENU (ONLY DESKTOP) */}
        <div className="desktopMenu" style={styles.desktopMenu}>
          <Link style={styles.link} to="/">Home</Link>
          <Link style={styles.link} to="/menu">Menu</Link>
          <Link style={styles.link} to="/reservation">Reservation</Link>
          <Link style={styles.link} to="/about">About</Link>

          {isAdmin && (
            <Link style={styles.link} to="/dashboard">Dashboard</Link>
          )}

          {user ? (
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          ) : (
            <Link style={styles.loginBtn} to="/login">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* MOBILE MENU (SLIDE) */}
      <div
        style={{
          ...styles.mobileMenu,
          right: menuOpen ? "0" : "-100%",
        }}
      >
        <Link onClick={() => setMenuOpen(false)} style={styles.link} to="/">Home</Link>
        <Link onClick={() => setMenuOpen(false)} style={styles.link} to="/menu">Menu</Link>
        <Link onClick={() => setMenuOpen(false)} style={styles.link} to="/reservation">Reservation</Link>
        <Link onClick={() => setMenuOpen(false)} style={styles.link} to="/about">About</Link>

        {isAdmin && (
          <Link onClick={() => setMenuOpen(false)} style={styles.link} to="/dashboard">
            Dashboard
          </Link>
        )}

        {user ? (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        ) : (
          <Link
  style={styles.loginBtn}
  to="/login"
  onClick={() => setMenuOpen(false)}
>
  Login
</Link>
        )}
      </div>

      {/* RESPONSIVE RULES */}
      <style>{`
        @media (max-width: 768px) {
          .desktopMenu {
            display: none !important;
          }
          .hamburger {
            display: block !important;
          }
        }

        @media (min-width: 769px) {
          .hamburger {
            display: none !important;
          }
          .mobileMenu {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    backgroundColor: "#1F1F1F",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logoImg: { height: "60px" },
  title: { color: "#D4AF37" },

  hamburger: {
    fontSize: "30px",
    color: "#D4AF37",
    cursor: "pointer",
    display: "none",
  },

  desktopMenu: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },

  mobileMenu: {
    position: "fixed",
    top: 0,
    right: "-100%",
    width: "250px",
    height: "100vh",
    backgroundColor: "#111",
    display: "flex",
    flexDirection: "column",
    paddingTop: "80px",
    gap: "20px",
    alignItems: "center",
    transition: "0.3s ease",
    zIndex: 999,
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
  },

  loginBtn: {
    background: "#8B0000",
    padding: "10px 20px",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
  },

  logoutBtn: {
    background: "#333",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  logoLink: {
  textDecoration: "none",
  color: "inherit",
},
};

export default Navbar;