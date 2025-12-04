import React from "react";

export default function StudentDashboard() {
  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Participant</h2>
        <a style={styles.link} href="#">🏠 Home</a>
        <a style={styles.link} href="#">📅 Events</a>
        <a style={styles.link} href="#">📝 My Registrations</a>
        <a style={styles.link} href="#">🔔 Notifications</a>
        <a style={styles.link} href="#">👤 Profile</a>
        <a style={styles.logout} href="#">🚪 Logout</a>
      </div>

      {/* Main Dashboard */}
      <div style={styles.main}>
        <h1 style={styles.title}>Helloo Hunters!!</h1>

        {/* Cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Upcoming Events</h3>
            <p>View all upcoming technical, sports & cultural events</p>
          </div>

          <div style={styles.card}>
            <h3>Registered Events</h3>
            <p>See events you already registered for</p>
          </div>

          <div style={styles.card}>
            <h3>Event Calendar</h3>
            <p>Check monthly event schedule</p>
          </div>
        </div>

        {/* Event List Section */}
        <h2 style={{ marginTop: "30px" }}>Recent Events</h2>

        <div style={styles.eventList}>
          <div style={styles.eventCard}>
            <h3>Code Hackathon</h3>
            <p>Organized by: CodeAThon2025</p>
            <button style={styles.btn}>View Event</button>
          </div>

          <div style={styles.eventCard}>
            <h3>Workshops</h3>
            <p>Organized by: CodeIndia</p>
            <button style={styles.btn}>View Event</button>
          </div>

          <div style={styles.eventCard}>
            <h3>Treasure Hunt</h3>
            <p>Organized by: HackerEarth</p>
            <button style={styles.btn}>View Event</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========= CSS Styles ========= */

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#87CEEB"
  },

  sidebar: {
    width: "230px",
    background: "#1e1e2e",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  logo: {
    fontSize: "26px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#7dc4ff"
  },

  link: {
    color: "#fff",
    textDecoration: "none",
    padding: "5px"
  },

  logout: {
    color: "#ff6b6b",
    marginTop: "auto",
    textDecoration: "none",
    padding: "5px"
  },

  main: {
    flex: 1,
    padding: "30px"
  },

  title: {
    marginBottom: "20px"
  },

  cards: {
    display: "flex",
    gap: "20px"
  },

  card: {
    width: "250px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  },

  eventList: {
    display: "flex",
    gap: "20px",
    marginTop: "15px"
  },

  eventCard: {
    width: "250px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  },

  btn: {
    background: "#000080",
    color: "#fff",
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    marginTop: "10px"
  }
};