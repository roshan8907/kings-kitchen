import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
  googleProvider,
} from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // EMAIL LOGIN
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const user = userCredential.user;

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnap =
        await getDoc(userRef);

      if (!userSnap.exists()) {
        alert(
          "Unable to verify your account."
        );

        await signOut(auth);
        return;
      }

      const userData =
        userSnap.data();

      // BLOCKED ACCOUNT
      if (
        userData.status === "blocked"
      ) {
        alert(
          "🚫 Your account is blocked by admin."
        );

        await signOut(auth);
        return;
      }

      // ADMIN
      if (
        userData.role === "admin"
      ) {
        alert(
          "Admin login successful."
        );

        navigate("/dashboard");
        return;
      }

      // NORMAL USER
      navigate("/");
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          alert(
            "Invalid email or password."
          );
          break;

        case "auth/invalid-email":
          alert(
            "Please enter a valid email address."
          );
          break;

        case "auth/too-many-requests":
          alert(
            "Too many login attempts. Please try again later."
          );
          break;

        case "auth/network-request-failed":
          alert(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          alert(
            "Unable to complete login. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin =
    async () => {
      try {
        setLoading(true);

        const result =
          await signInWithPopup(
            auth,
            googleProvider
          );

        const user = result.user;

        const userRef = doc(
          db,
          "users",
          user.uid
        );

        const userSnap =
          await getDoc(userRef);

        // CREATE NEW GOOGLE USER
        if (!userSnap.exists()) {
          await setDoc(
            userRef,
            {
              uid: user.uid,
              fullName:
                user.displayName || "",
              email:
                user.email || "",
              status: "active",
              role: "user",
            }
          );

          alert(
            "Google Login Successful"
          );

          navigate("/");
          return;
        }

        const userData =
          userSnap.data();

        // BLOCKED GOOGLE ACCOUNT
        if (
          userData.status ===
          "blocked"
        ) {
          alert(
            "🚫 Your account is blocked by admin."
          );

          await signOut(auth);
          return;
        }

        // ADMIN GOOGLE ACCOUNT
        if (
          userData.role === "admin"
        ) {
          alert(
            "Admin login successful."
          );

          navigate("/dashboard");
          return;
        }

        // NORMAL GOOGLE USER
        alert(
          "Google Login Successful"
        );

        navigate("/");
      } catch (error) {
        console.error(
          "Google login error:",
          error
        );

        if (
          error.code ===
          "auth/popup-closed-by-user"
        ) {
          return;
        }

        if (
          error.code ===
          "auth/popup-blocked"
        ) {
          alert(
            "The Google login popup was blocked by the browser."
          );

          return;
        }

        alert(
          "Unable to complete Google login. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  // RESET PASSWORD
  const handleResetPassword =
    async () => {
      if (!email.trim()) {
        alert(
          "Please enter your email address first."
        );

        return;
      }

      try {
        await sendPasswordResetEmail(
          auth,
          email.trim()
        );

        alert(
          "Password reset email sent. Please check your inbox and spam folder."
        );
      } catch (error) {
        console.error(
          "Password reset error:",
          error
        );

        if (
          error.code ===
          "auth/invalid-email"
        ) {
          alert(
            "Please enter a valid email address."
          );
        } else {
          alert(
            "Unable to send the password reset email. Please try again."
          );
        }
      }
    };

  return (
    <div
      style={styles.loginContainer}
    >
      <div style={styles.overlay}>
        <div style={styles.loginBox}>

          <h2 style={styles.title}>
            Login Your Account
          </h2>

          {/* EMAIL */}
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="Enter Email"
            style={styles.input}
            disabled={loading}
          />

          {/* PASSWORD */}
          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            placeholder="Enter Password"
            style={styles.input}
            disabled={loading}
          />

          {/* LOGIN */}
          <button
            onClick={handleLogin}
            style={styles.btn}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : "Login"}
          </button>

          {/* GOOGLE LOGIN */}
          <button
            onClick={
              handleGoogleLogin
            }
            style={
              styles.googleBtn
            }
            disabled={loading}
          >
            Continue with Google
          </button>

          {/* FORGOT PASSWORD */}
          <button
            onClick={
              handleResetPassword
            }
            style={
              styles.forgotLink
            }
            disabled={loading}
          >
            Forgot Password?
          </button>

          {/* REGISTER */}
          <p style={styles.text}>
            Don't have an account?{" "}

            <Link
              to="/register"
              style={styles.link}
            >
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

    backgroundPosition:
      "center",
  },

  overlay: {
    backgroundColor:
      "rgba(0,0,0,0.55)",

    width: "100%",

    height: "100%",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",
  },

  loginBox: {
    width: "400px",

    backgroundColor:
      "rgba(255,255,255,0.08)",

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

    boxSizing: "border-box",
  },

  btn: {
    width: "100%",

    padding: "15px",

    backgroundColor:
      "#8B0000",

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

    textDecoration:
      "underline",
  },

  googleBtn: {
    width: "100%",

    padding: "15px",

    marginTop: "15px",

    backgroundColor:
      "#ffffff",

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