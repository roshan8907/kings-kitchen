import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo1.png";

import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";

function Navbar() {
  const handleLogout = async () => {
  try {
    await signOut(auth);
    setUser(null); // optional (Firebase already updates it)
  } catch (error) {
    console.log("Logout error:", error);
  }
};

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === "admin@gmail.com";

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <img src={logo} alt="logo" style={styles.logoImg} />
        <h2 style={styles.title}>The King's Kitchen</h2>
      </div>

      <div style={styles.links}>
        <Link style={styles.link} to="/">Home</Link>

        <Link style={styles.link} to="/menu">
          Menu
        </Link>

        <Link style={styles.link} to="/reservation">
          Reservation
        </Link>

        <Link style={styles.link} to="/about">
          About Us
        </Link>

        {isAdmin && (
          <Link style={styles.link} to="/admin">
            Dashboard
          </Link>
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
  );
}

const styles = {
  nav:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    padding:"18px 50px",
    backgroundColor:"#1F1F1F",
    boxShadow:"0 2px 8px rgba(0,0,0,0.5)"
  },

  left:{
    display:"flex",
    alignItems:"center",
    gap:"12px"
  },

  logoImg:{
    height:"70px"
  },

  title:{
    color:"#D4AF37",
    fontFamily:"Playfair Display, serif"
  },

  links:{
    display:"flex",
    alignItems:"center",
    gap:"25px"
  },

  link:{
    color:"#F5F5DC",
    textDecoration:"none",
    fontSize:"17px"
  },

  loginBtn:{
    color:"#fff",
    textDecoration:"none",
    backgroundColor:"#8B0000",
    padding:"8px 18px",
    borderRadius:"5px"
  },

  logoutBtn: {
  backgroundColor: "#333",
  color: "#fff",
  border: "none",
  padding: "8px 18px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px"
}
};

export default Navbar;