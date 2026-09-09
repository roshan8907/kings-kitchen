import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo1.png";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        // No user logged in
        if (!currentUser) {
          setIsAdmin(false);
          return;
        }

        // Check user's role in Firestore
        try {
          const userRef = doc(
            db,
            "users",
            currentUser.uid
          );

          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();

            setIsAdmin(userData.role === "admin");
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error(
            "Error checking admin role:",
            error
          );

          setIsAdmin(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={styles.nav}>

        {/* LEFT */}
        <div style={styles.left}>

          <Link to="/" style={styles.logoLink}>
            <img
              src={logo}
              alt="logo"
              style={styles.logoImg}
            />
          </Link>

          <Link to="/" style={styles.logoLink}>
            <h2 style={styles.title}>
              The King's Kitchen
            </h2>
          </Link>

        </div>


        {/* HAMBURGER - MOBILE ONLY */}
        <div
          className="hamburger"
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>


        {/* DESKTOP MENU */}
        <div
          className="desktopMenu"
          style={styles.desktopMenu}
        >

          {/* HOME */}
          <Link
            style={styles.link}
            to="/"
          >
            Home
          </Link>


          {/* MENU */}
          <Link
            style={styles.link}
            to={isAdmin ? "/admin/menu" : "/menu"}
          >
            Menu
          </Link>


          {/* RESERVATION */}
          <Link
            style={styles.link}
            to={
              isAdmin
                ? "/admin/reservation"
                : "/reservation"
            }
          >
            Reservation
          </Link>


          {/* ABOUT */}
          <Link
            style={styles.link}
            to="/about"
          >
            About
          </Link>


          {/* ADMIN DASHBOARD */}
          {isAdmin && (
            <Link
              style={styles.link}
              to="/dashboard"
            >
              Dashboard
            </Link>
          )}


          {/* LOGIN / LOGOUT */}
          {user ? (
            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
            >
              Logout
            </button>
          ) : (
            <Link
              style={styles.loginBtn}
              to="/login"
            >
              Login
            </Link>
          )}

        </div>
      </nav>


      {/* MOBILE MENU */}
      <div
        style={{
          ...styles.mobileMenu,
          right: menuOpen ? "0" : "-100%",
        }}
      >

        {/* HOME */}
        <Link
          onClick={() => setMenuOpen(false)}
          style={styles.link}
          to="/"
        >
          Home
        </Link>


        {/* MENU */}
        <Link
          onClick={() => setMenuOpen(false)}
          style={styles.link}
          to={isAdmin ? "/admin/menu" : "/menu"}
        >
          Menu
        </Link>


        {/* RESERVATION */}
        <Link
          onClick={() => setMenuOpen(false)}
          style={styles.link}
          to={
            isAdmin
              ? "/admin/reservation"
              : "/reservation"
          }
        >
          Reservation
        </Link>


        {/* ABOUT */}
        <Link
          onClick={() => setMenuOpen(false)}
          style={styles.link}
          to="/about"
        >
          About
        </Link>


        {/* ADMIN DASHBOARD */}
        {isAdmin && (
          <Link
            onClick={() => setMenuOpen(false)}
            style={styles.link}
            to="/dashboard"
          >
            Dashboard
          </Link>
        )}


        {/* LOGIN / LOGOUT */}
        {user ? (
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
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

  logoImg: {
    height: "60px",
  },

  title: {
    color: "#D4AF37",
  },

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