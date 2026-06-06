function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        padding: "50px 20px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h3
          style={{
            color: "#D4AF37",
            fontSize: "30px",
            marginBottom: "15px",
          }}
        >
          King's Kitchen
        </h3>

        <p
          style={{
            color: "#cccccc",
            lineHeight: "1.8",
            marginBottom: "15px",
          }}
        >
          Delicious food, warm hospitality, and memorable dining experiences.
        </p>

        <p
          style={{
            color: "#cccccc",
            marginBottom: "30px",
          }}
        >
          Auckland, New Zealand | 📞 +64 XX XXX XXXX | ✉️ info@kingskitchen.com
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <a href="/" style={{ color: "#cccccc", textDecoration: "none" }}>
            Home
          </a>

          <a href="/menu" style={{ color: "#cccccc", textDecoration: "none" }}>
            Menu
          </a>

          <a href="/about" style={{ color: "#cccccc", textDecoration: "none" }}>
            About Us
          </a>

          <a
            href="/reservation"
            style={{ color: "#cccccc", textDecoration: "none" }}
          >
            Reservations
          </a>

          <a
            href="/contact"
            style={{ color: "#cccccc", textDecoration: "none" }}
          >
            Contact
          </a>
        </div>

        <div
          style={{
            borderTop: "1px solid #333",
            paddingTop: "20px",
            color: "#888",
            fontSize: "14px",
          }}
        >
          © {new Date().getFullYear()} Kings Kitchen. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;