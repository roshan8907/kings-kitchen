function Home() {
  return (
<div>
    {/*hero sectio n  or welcome section */}  
    <div style={styles.hero}>
      <div style={styles.overlay}>
        <h1 style={styles.heading}>Welcome to The King's Kitchen</h1>
        <p style={styles.text}>
          Experience unforgettable dining, premium cuisine, and warm hospitality.
        </p>

        <button style={styles.btn}>Book a Table</button>
      </div>
    </div>

{/* Why Choose Us Section */}

      <div style={styles.chooseSection}>
        <h2 style={styles.chooseTitle}>Why Choose Us?</h2>
        <div style={styles.cardContainer}>
          <div style={styles.card}>
            <h3>Premium Cuisine</h3>
            <p>Enjoy dishes crafted by expert chefs using fresh ingredients.</p>
          </div>
          <div style={styles.card}>
            <h3> Elegant Ambience</h3>
            <p>Experience a luxurious and comfortable dining environment.</p>
          </div>
          <div style={styles.card}>
            <h3> Excellent Service</h3>
            <p>Our staff ensures every guest receives royal hospitality.</p>
          </div>
        </div>
      </div>
    </div>





  );
}

const styles = {
  hero:{
    height:"85vh",
    backgroundImage:"url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')",
    backgroundSize:"cover",
    backgroundPosition:"center",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },

  overlay:{
    backgroundColor:"rgba(0,0,0,0.55)",
    width:"100%",
    height:"100%",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    textAlign:"center"
  },

  heading:{
    fontSize:"64px",
    color:"#D4AF37",
    fontFamily:"Playfair Display, serif",
    marginBottom:"20px",
    textShadow:"2px 2px 10px rgba(0,0,0,0.9)"
},

  text:{
    fontSize:"24px",
    color:"#F5F5DC",
    marginBottom:"30px",
    textShadow:"2px 2px 6px black"
  },

  btn:{
    backgroundColor:"#8B0000",
    color:"white",
    border:"none",
    padding:"15px 30px",
    fontSize:"18px",
    borderRadius:"6px",
    cursor:"pointer"
  },

// why you chose us css 

 chooseSection:{
    padding:"80px 100px",
    backgroundColor:"#1F1F1F",
    textAlign:"center"
  },

  chooseTitle:{
    fontSize:"42px",
    color:"#D4AF37",
    marginBottom:"50px",
    fontFamily:"Playfair Display, serif"
  },

  cardContainer:{
    display:"flex",
    justifyContent:"center",
    gap:"30px",
    flexWrap:"wrap"
  },

  card:{
    backgroundColor:"#ffffff",
    color:"#000000",
    width:"280px",
    padding:"30px",
    borderRadius:"10px",
    boxShadow:"0 4px 10px rgba(0,0,0,0.5)",
    lineHeight:"1.6"
  },
  
};

export default Home;