const teamMembers = [
  {
    id: 1,
    name: "Chef Daniel",
    role: "Head Chef",
    image: "/images/chef1.jpg",
  },
  {
    id: 2,
    name: "Sophia Lee",
    role: "Restaurant Manager",
    image: "/images/manager.jpg",
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Customer Service",
    image: "/images/service.jpg",
  },
];

function AboutUs() {
  return (
    <div
      style={{
        backgroundColor: "#fff8f0",
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
            color: "#b1451b",
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
            color: "#555",
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
          src="/images/restaurant.jpg"
          alt="Restaurant"
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
              color: "#b1451b",
              marginBottom: "20px",
            }}
          >
            Our Story
          </h2>

          <p
            style={{
              color: "#555",
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
            color: "#b1451b",
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

          
      