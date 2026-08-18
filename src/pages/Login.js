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
  addDoc,
  collection,
  serverTimestamp,
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

  // SECURITY LOGGING
  const logSecurityEvent = async ({
    event,
    email: eventEmail = "",
    userId = "",
    details = "",
  }) => {
    try {
      await addDoc(collection(db, "securityLogs"), {
        event,
        email: eventEmail,
        userId,
        details,
        timestamp: serverTimestamp(),
      });
    } catch (logError) {
      // Logging failure should not stop normal login behaviour.
      console.error(
        "Security logging error:",
        logError
      );
    }
  };

  // EMAIL LOGIN
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Please enter your email and password.");
      return;
    }

    const enteredEmail = email.trim();

    try {
      setLoading(true);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          enteredEmail,
          password
        );

      const user = userCredential.user;

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await logSecurityEvent({
          event: "LOGIN_USER_RECORD_MISSING",
          email: enteredEmail,
          userId: user.uid,
          details:
            "Authenticated account has no Firestore user record.",
        });

        alert("Unable to verify your account.");
        await signOut(auth);
        return;
      }

      const userData = userSnap.data();

      // BLOCKED ACCOUNT
      if (userData.status === "blocked") {
        await logSecurityEvent({
          event: "BLOCKED_LOGIN_ATTEMPT",
          email: user.email || enteredEmail,
          userId: user.uid,
          details:
            "Blocked account attempted email login.",
        });

        alert(
          "🚫 Your account is blocked by admin."
        );

        await signOut(auth);
        return;
      }

      // ADMIN
      if (userData.role === "admin") {
        navigate("/dashboard");
        return;
      }

      // NORMAL USER
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      await logSecurityEvent({
        event: "LOGIN_FAILED",
        email: enteredEmail,
        details:
          error.code || "Unknown authentication error",
      });

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          alert("Invalid email or password.");
          break;

        case "auth/invalid-email":
          alert("Please enter a valid email address.");
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
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const user = result.user;

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnap = await getDoc(userRef);

      // NEW GOOGLE USER
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          fullName: user.displayName || "",
          email: user.email || "",
          status: "active",
          role: "user",
        });

        navigate("/");
        return;
      }

      const userData = userSnap.data();

      // BLOCKED GOOGLE ACCOUNT
      if (userData.status === "blocked") {
        await logSecurityEvent({
          event: "BLOCKED_GOOGLE_LOGIN_ATTEMPT",
          email: user.email || "",
          userId: user.uid,
          details:
            "Blocked Google-authenticated account attempted login.",
        });

        alert(
          "🚫 Your account is blocked by admin."
        );

        await signOut(auth);
        return;
      }

      // ADMIN GOOGLE ACCOUNT
      if (userData.role === "admin") {
        navigate("/dashboard");
        return;
      }

      // NORMAL GOOGLE USER
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

      await logSecurityEvent({
        event: "GOOGLE_LOGIN_FAILED",
        details:
          error.code ||
          "Unknown Google authentication error",
      });

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

  // PASSWORD RESET
  const handleResetPassword = async () => {
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

      await logSecurityEvent({
        event: "PASSWORD_RESET_FAILED",
        email: email.trim(),
        details:
          error.code ||
          "Unknown password reset error",
      });

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
    <div style={styles.loginContainer}>
      <div style={styles.overlay}>
        <div style={styles.loginBox}>

          <h2 style={styles.title}>
            Login Your Account
          </h2>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter Email"
            style={styles.input}
            disabled={loading}
          />

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter Password"
            style={styles.input}
            disabled={loading}
          />

          <button
            onClick={handleLogin}
            style={styles.btn}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : "Login"}
          </button>

          <button
            onClick={handleGoogleLogin}
            style={styles.googleBtn}
            disabled={loading}
          >
            Continue with Google
          </button>

          <button
            onClick={handleResetPassword}
            style={styles.forgotLink}
            disabled={loading}
          >
            Forgot Password?
          </button>

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