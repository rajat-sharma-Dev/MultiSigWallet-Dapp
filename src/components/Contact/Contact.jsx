import React from "react";
import {
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa6";
import "./Contact.css";

const Contact = () => {
  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/rajat-sharma-25659b257/",
      icon: <FaLinkedin />,
      color: "#0077b5",
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/Rajat_shrma_",
      icon: <FaXTwitter />,
      color: "#1DA1F2",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/_rajat_srma/",
      icon: <FaInstagram />,
      color: "#E4405F",
    },
    {
      name: "Email",
      url: "mailto:rajatsharma.dev1@gmail.com",
      icon: <FaEnvelope />,
      color: "#EA4335",
    },
  ];

  return (
    <div className="contact-container">
      <div className="contact-content">
        <h1 className="contact-title">Let's Connect</h1>
        <p className="contact-subtitle">
          Feel free to reach out through any of these platforms
        </p>

        <div className="social-links">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              style={{ "--hover-color": link.color }}
            >
              <div className="social-icon">{link.icon}</div>
              <span className="social-name">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
