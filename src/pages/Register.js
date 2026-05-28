import { Link } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Register(){

// ADD STATES
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

// CREATE FUNCTION

const handleRegister = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("User Created Successfully");
  } catch (error) {
    alert(error.message);
  }
};



  return (
    <div style={styles.registerContainer}>
      <div style={styles.overlay}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Create Your Account</h2>

          <input
        type="text"
        placeholder="Enter Full Name"
        style={styles.input}
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Email"
        style={styles.input}
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
        style={styles.input}
      />
          <button onClick={handleRegister} style={styles.btn}>Register</button>

          <p style={styles.text}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}




const styles = {
  registerContainer: {
    height: "100vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  formBox: {
    width: "420px",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    backdropFilter: "blur(5px)",
  },

  title: {
    color: "#D4AF37",
    marginBottom: "25px",
    fontSize: "30px",
  },

  input: {
    width: "100%",
    padding: "15px",
    marginBottom: "18px",
    borderRadius: "5px",
    border: "none",
    fontSize: "16px",
  },

  btn: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#8B0000",
    color: "white",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "5px",
  },

  text: {
    color: "white",
    marginTop: "20px",
  },

  link: {
    color: "#D4AF37",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Register;