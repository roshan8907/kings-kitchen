const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const {
  initializeApp,
  cert,
} = require("firebase-admin/app");

const {
  getAuth,
} = require("firebase-admin/auth");

const {
  getFirestore,
} = require("firebase-admin/firestore");

// --------------------------------------------------
// FIREBASE ADMIN
// --------------------------------------------------

const serviceAccount = require(
  "./firebase-service-account.json"
);

initializeApp({
  credential: cert(serviceAccount),
});

const adminAuth = getAuth();
const db = getFirestore();

// --------------------------------------------------
// EXPRESS SERVER
// --------------------------------------------------

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message:
      "King's Kitchen authentication server is running.",
  });
});

// --------------------------------------------------
// REGISTER
// --------------------------------------------------

app.post(
  "/api/auth/register",
  async (req, res) => {
    try {
      const {
        email,
        password,
        fullName,
      } = req.body;

      // -------------------------------
      // VALIDATION
      // -------------------------------

      if (
        !email ||
        !password ||
        !fullName
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Full name, email and password are required.",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 8 characters long.",
        });
      }

      if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
          success: false,
          message:
            "Password must contain at least one uppercase letter.",
        });
      }

      if (!/[0-9]/.test(password)) {
        return res.status(400).json({
          success: false,
          message:
            "Password must contain at least one number.",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      // -------------------------------
      // CHECK EXISTING ACCOUNT
      // -------------------------------

      try {
        await adminAuth.getUserByEmail(
          normalizedEmail
        );

        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists.",
        });
      } catch (error) {
        if (
          error.code !==
          "auth/user-not-found"
        ) {
          throw error;
        }
      }

      // -------------------------------
      // CREATE FIREBASE USER
      // -------------------------------

      const userRecord =
        await adminAuth.createUser({
          email: normalizedEmail,
          displayName: fullName.trim(),
        });

      // -------------------------------
      // BCRYPT HASHING
      // -------------------------------

      const passwordHash =
        await bcrypt.hash(
          password,
          12
        );

      // -------------------------------
      // STORE USER DATA
      // -------------------------------

      await db
        .collection("users")
        .doc(userRecord.uid)
        .set({
          uid: userRecord.uid,
          fullName:
            fullName.trim(),
          email: normalizedEmail,
          passwordHash:
            passwordHash,
          status: "active",
          role: "user",
        });

      // -------------------------------
      // CUSTOM TOKEN
      // -------------------------------

      const customToken =
        await adminAuth.createCustomToken(
          userRecord.uid
        );

      return res.status(201).json({
        success: true,
        token: customToken,
        message:
          "Account created successfully.",
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to create the account.",
      });
    }
  }
);

// --------------------------------------------------
// LOGIN
// --------------------------------------------------

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      // -------------------------------
      // VALIDATION
      // -------------------------------

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required.",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      // -------------------------------
      // FIND FIREBASE USER
      // -------------------------------

      let userRecord;

      try {
        userRecord =
          await adminAuth.getUserByEmail(
            normalizedEmail
          );
      } catch (error) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password.",
        });
      }

      // -------------------------------
      // GET FIRESTORE USER
      // -------------------------------

      const userRef = db
        .collection("users")
        .doc(userRecord.uid);

      const userSnap =
        await userRef.get();

      if (!userSnap.exists) {
        return res.status(401).json({
          success: false,
          message:
            "Unable to verify your account.",
        });
      }

      const userData =
        userSnap.data();

      // -------------------------------
      // BLOCKED ACCOUNT
      // -------------------------------

      if (
        userData.status ===
        "blocked"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Your account is blocked by admin.",
        });
      }

      // -------------------------------
      // CHECK BCRYPT HASH
      // -------------------------------

      if (
        !userData.passwordHash
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Password authentication is not configured for this account.",
        });
      }

      const passwordMatches =
        await bcrypt.compare(
          password,
          userData.passwordHash
        );

      // -------------------------------
      // WRONG PASSWORD
      // -------------------------------

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password.",
        });
      }

      // -------------------------------
      // CREATE CUSTOM TOKEN
      // -------------------------------

      const customToken =
        await adminAuth.createCustomToken(
          userRecord.uid
        );

      // -------------------------------
      // LOGIN SUCCESS
      // -------------------------------

      return res.status(200).json({
        success: true,
        token: customToken,
        user: {
          uid: userRecord.uid,
          email:
            userRecord.email,
          fullName:
            userData.fullName || "",
          role:
            userData.role || "user",
          status:
            userData.status || "active",
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to complete login.",
      });
    }
  }
);

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `King's Kitchen backend running on http://localhost:${PORT}`
  );
});