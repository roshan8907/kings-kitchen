const teamMembers = [
  {
    id: 1,
    name: "Chef Daniel",
    role: "Head Chef",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Sophia Lee",
    role: "Restaurant Manager",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Customer Service",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

function AboutUs() {
  return (
    <div
      style={{
        backgroundColor: "#000000",
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "50px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            color: "#edf54e",
            marginBottom: "15px",
          }}
        >
          About Us
        </h1>
        <p
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            fontSize: "18px",
            color: "#ebe5e5",
            lineHeight: "1.8",
          }}
        >
          Welcome to Kings Kitchen. We are passionate about creating delicious
          meals made with fresh ingredients and providing an unforgettable dining
          experience for our customers.
        </p>
      </div>
      
      {/* Story Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
          marginBottom: "70px",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Restaurant interior"
          style={{
            width: "400px",
            maxWidth: "100%",
            borderRadius: "20px",
            objectFit: "cover",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        />
        <div
          style={{
            maxWidth: "500px",
          }}
        >
          <h2
            style={{
              color: "#e2ee41",
              marginBottom: "20px",
            }}
          >
            Our Story
          </h2>
          <p
            style={{
              color: "#fffdfd",
              lineHeight: "1.8",
              fontSize: "17px",
            }}
          >
            Kings Kitchen started with the goal of bringing people together
            through food. Since our opening, we have focused on quality,
            excellent service, and creating a warm atmosphere where everyone
            feels welcome.
          </p>
        </div>
      </div>
      
      {/* Team Section */}
      <div>
        <h2
          style={{
            textAlign: "center",
            color: "#f1e83f",
            marginBottom: "40px",
            fontSize: "36px",
          }}
        >
          Meet Our Team
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          {teamMembers.map((member) => (
            <div
              key={member.id}
              style={{
                backgroundColor: "white",
                width: "280px",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                textAlign: "center",
                paddingBottom: "20px",
              }}
            >
              <img
                src={member.image}
                alt={member.name}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/280x250?text=Image+Not+Found";
                }}
              />
              <h3
                style={{
                  marginTop: "20px",
                  color: "#333",
                }}
              >
                {member.name}
              </h3>
              <p
                style={{
                  color: "#777",
                }}
              >
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutUs;

          
      