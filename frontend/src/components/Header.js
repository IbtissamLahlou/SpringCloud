import React from "react";

export default function Header() {
  // Styles sous forme d'objets JavaScript
  const headerStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1b1f38", // Bleu foncé/noir
    padding: "10px 0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  };

  const linkStyle = {
    color: "#ffffff", // Blanc
    textDecoration: "none",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "10px 15px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  const linkHoverStyle = {
    backgroundColor: "#3a4a6b", // Bleu clair
    color: "#e3e3e3", // Gris clair
  };

  // Gestion du survol avec useState pour chaque lien
  const [hoveredLink, setHoveredLink] = React.useState(null);

  return (
    <div style={headerStyle}>
      {[
        { href: "/students", text: "Liste des étudiants" },
        { href: "/courses", text: "Liste des cours" },
        { href: "/create-course", text: "Créer un cours" },
        { href: "/create-student", text: "Créer un étudiant" },
        { href: "/enroll", text: "Inscrire un étudiant" },
      ].map((link, index) => (
        <a
          key={index}
          href={link.href}
          style={
            hoveredLink === index
              ? { ...linkStyle, ...linkHoverStyle } // Applique le style de survol si l'élément est actif
              : linkStyle
          }
          onMouseEnter={() => setHoveredLink(index)}
          onMouseLeave={() => setHoveredLink(null)}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
}
