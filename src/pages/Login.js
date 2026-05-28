import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup
} from "firebase/auth";

import { auth, googleProvider } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // EMAIL LOGIN
 const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // ADMIN
    if (userCredential.user.email === "admin@gmail.com") {
      navigate("/admin");
    }

    // NORMAL USER
    else {
      navigate("/");
    }

  } catch (error) {
    alert(error.message);
  }
};
  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
      alert("Google Login Successful");
    } catch (error) {
      alert(error.message);
    }
  };


  // RESET PASSWORD
  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      alert(error.message);
    }
  };

  
  
  return (
    <div style={styles.loginContainer}>
      <div style={styles.overlay}>
        <div style={styles.loginBox}>

          <h2 style={styles.title}>Login Your Account</h2>

          {/* EMAIL */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            style={styles.input}
          />

          {/* PASSWORD */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            style={styles.input}
          />

          {/* LOGIN BUTTON */}
          <button onClick={handleLogin} style={styles.btn}>
            Login
          </button>

          {/* GOOGLE LOGIN */}
          <button onClick={handleGoogleLogin} style={styles.googleBtn}>
            Continue with Google
          </button>
          {/* FORGOT PASSWORD */}
          <button onClick={handleResetPassword} style={styles.forgotLink}>
            Forgot Password?
          </button>

         

          {/* REGISTER */}
          <p style={styles.text}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.link}>
              Register Here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

const styles = {

  loginContainer: {
    height: "100vh",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')",
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

  loginBox: {
    width: "400px",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    backdropFilter: "blur(5px)",
  },

  title: {
    color: "#D4AF37",
    marginBottom: "30px",
    fontSize: "28px",
  },

  input: {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
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

  forgotLink: {
    background: "none",
    border: "none",
    color: "#D4AF37",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "700",
    textDecoration: "underline",
  },

  googleBtn: {
    width: "100%",
    padding: "15px",
    marginTop: "15px",
    backgroundColor: "#ffffff",
    color: "#000",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    fontWeight: "bold",
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

export default Login;