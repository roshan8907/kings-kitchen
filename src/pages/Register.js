import { Link } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          uid: userCredential.user.uid,
          fullName: fullName.trim(),
          email: email.trim(),
          status: "active",
          role: "user",
        }
      );

      alert("User Created Successfully");

      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.registerContainer}>
      <div style={styles.overlay}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>
            Create Your Account
          </h2>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setError("");
              }}
              placeholder="Enter Full Name"
              style={styles.input}
            />

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter Email"
              style={styles.input}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Password"
              style={styles.input}
            />

            <p style={styles.passwordHint}>
              Password: 8+ characters, 1 uppercase letter,
              and 1 number.
            </p>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              placeholder="Confirm Password"
              style={styles.input}
            />

            {error && (
              <p style={styles.error}>
                {error}
              </p>
            )}

            <button
              type="submit"
              style={styles.btn}
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </button>
          </form>

          <p style={styles.text}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={styles.link}
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  registerContainer: {
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
    marginBottom: "12px",
    borderRadius: "5px",
    border: "none",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  passwordHint: {
    color: "#ccc",
    fontSize: "12px",
    textAlign: "left",
    marginBottom: "15px",
  },

  error: {
    color: "#ff6b6b",
    backgroundColor: "rgba(255,0,0,0.1)",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
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