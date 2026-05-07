import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <img src={logo} alt="logo" style={styles.logoImg} />
        <h2 style={styles.title}>The King's Kitchen</h2>
      </div>

      <div style={styles.links}>
        <Link style={styles.link} to="/">Home</Link>
        <Link style={styles.link} to="/menu">Menu</Link>
        <Link style={styles.link} to="/reservation">Reservation</Link>
         <Link style={styles.link} to="/about">About Us</Link>
        <Link style={styles.loginBtn} to="/login">Login</Link>
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
  }
};

export default Navbar;