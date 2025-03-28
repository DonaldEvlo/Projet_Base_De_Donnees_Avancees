import React from "react";

function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Introuvable</h1>
      <p style={styles.message}>
        Désolé, la page que vous recherchez n'existe pas.
      </p>
      <a href="/" style={styles.link}>Retour à l'accueil</a>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  title: {
    fontSize: "48px",
    color: "#333",
  },
  message: {
    fontSize: "18px",
    color: "#666",
  },
  link: {
    marginTop: "20px",
    display: "inline-block",
    fontSize: "16px",
    color: "#007BFF",
    textDecoration: "none",
  },
};

export default NotFound;