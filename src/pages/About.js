const teamMembers = [
  {
    id: 1,
    name: "Chef Daniel",
    role: "Head Chef",
    image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=800",
  },
  {
    id: 2,
    name: "Sophia Lee",
    role: "Restaurant Manager",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Customer Service",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
  },
];

 

function AboutUs() {

  return (

    <div style={styles.page}>

 

      {/* HERO */}

      <div style={styles.hero}>

 

        <h1 style={styles.mainTitle}>

          About Us

        </h1>

 

        <p style={styles.heroText}>

          Welcome to Kings Kitchen. We serve delicious meals

          made with fresh ingredients and provide a premium

          dining experience with excellent customer service.

        </p>

 

      </div>

 

      {/* STORY SECTION */}

      <div style={styles.storySection}>

 

        <div style={styles.imageContainer}>

          <img

            src="/img/restaurant.jpg"

            alt="Restaurant"

            style={styles.storyImage}

          />

        </div>

 

        <div style={styles.storyContent}>

 

          <h2 style={styles.sectionTitle}>

            Our Story

          </h2>

 

          <p style={styles.storyText}>

            Kings Kitchen started with the vision of bringing

            people together through amazing food and memorable

            experiences. From our kitchen to your table, we focus

            on quality, freshness, and customer satisfaction.

          </p>

 

          <p style={styles.storyText}>

            We believe food is more than just a meal —

            it is an experience that creates happiness,

            connection, and unforgettable memories.

          </p>

 

        </div>

 

      </div>

 

      {/* TEAM SECTION */}

      <div style={styles.teamSection}>

 

        <h2 style={styles.sectionTitleCenter}>

          Meet Our Team

        </h2>

 

        <div style={styles.teamGrid}>

 

          {teamMembers.map((member) => (

            <div key={member.id} style={styles.card}>

 

              <div style={styles.teamImageBox}>

                <img

                  src={member.image}

                  alt={member.name}

                  style={styles.teamImage}

                />

              </div>

 

              <div style={styles.cardContent}>

 

                <h3 style={styles.memberName}>

                  {member.name}

                </h3>

 

                <p style={styles.memberRole}>

                  {member.role}

                </p>

 

              </div>

 

            </div>

          ))}

 

        </div>

 

      </div>

 

    </div>

  );

}

 

const styles = {

 

  page: {

    background: "#0f0f0f",

    minHeight: "100vh",

    padding: "40px 20px",

    color: "white",

    fontFamily: "Arial, sans-serif",

  },

 

  hero: {

    textAlign: "center",

    marginBottom: "70px",

  },

 

  mainTitle: {

    fontSize: "52px",

    color: "#D4AF37",

    marginBottom: "20px",

    fontWeight: "bold",

  },

 

  heroText: {

    maxWidth: "850px",

    margin: "0 auto",

    fontSize: "18px",

    lineHeight: "1.8",

    color: "#cccccc",

  },

 

  storySection: {

    display: "flex",

    flexWrap: "wrap",

    alignItems: "center",

    justifyContent: "center",

    gap: "40px",

    marginBottom: "80px",

  },

 

  imageContainer: {

    flex: "1",

    minWidth: "300px",

    maxWidth: "500px",

  },

 

  storyImage: {

    width: "100%",

    borderRadius: "20px",

    objectFit: "cover",

    boxShadow: "0 0 20px rgba(0,0,0,0.5)",

  },

 

  storyContent: {

    flex: "1",

    minWidth: "300px",

    maxWidth: "550px",

  },

 

  sectionTitle: {

    color: "#D4AF37",

    fontSize: "36px",

    marginBottom: "20px",

  },

 

  sectionTitleCenter: {

    textAlign: "center",

    color: "#D4AF37",

    fontSize: "40px",

    marginBottom: "50px",

  },

 

  storyText: {

    color: "#cccccc",

    lineHeight: "1.9",

    fontSize: "17px",

    marginBottom: "20px",

  },

 

  teamSection: {

    marginTop: "40px",

  },

 

  teamGrid: {

    display: "grid",

    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",

    gap: "30px",

  },

 

  card: {

    background: "#1a1a1a",

    borderRadius: "20px",

    overflow: "hidden",

    boxShadow: "0 0 15px rgba(0,0,0,0.5)",

    transition: "0.3s",

  },

 

  teamImageBox: {

    width: "100%",

    height: "280px",

    overflow: "hidden",

  },

 

  teamImage: {

    width: "100%",

    height: "100%",

    objectFit: "cover",

  },

 

  cardContent: {

    padding: "20px",

    textAlign: "center",

  },

 

  memberName: {

    marginBottom: "10px",

    color: "white",

    fontSize: "22px",

  },

 

  memberRole: {

    color: "#D4AF37",

    fontSize: "15px",

  },

 

};

 

export default AboutUs;


