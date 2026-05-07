import { Link } from "react-router-dom";
function Login() {
  return (
    <div style={styles.loginContainer}>

      <div style={styles.overlay}>
        <div style={styles.loginBox}>
          <h2 style={styles.title}>Login Your Account</h2>

          <input type="email" placeholder="Enter Email" style={styles.input} />
          <input type="password" placeholder="Enter Password" style={styles.input} />

          <button style={styles.btn}>Login</button>

<p style={styles.text}>
      Don't have an account?{" "}
  <Link to="/register" style={styles.link}>
   Register Here
  </Link>
</p>        </div>
      </div>

    </div>
  );
}


const styles = {
  loginContainer: {
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

  text: {
    color: "white",
    marginTop: "20px",
  },
  link: {
  color: "#D4AF37",
  textDecoration: "none",
  fontWeight: "bold",
}
};

export default Login;