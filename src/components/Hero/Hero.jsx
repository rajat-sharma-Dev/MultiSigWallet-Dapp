import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Connect your Web3 wallet (like MetaMask) to get started",
      icon: "🦊",
    },
    {
      number: "02",
      title: "Add Owners",
      description:
        "Specify the number of wallet owners who will have signing authority",
      icon: "👥",
    },
    {
      number: "03",
      title: "Add addresses",
      description:
        "Insert the addresses of the approvers/owners apart from you",
      icon: "✍️",
    },
    {
      number: "04",
      title: "Deploy Wallet",
      description: "Create your MultiSig wallet on the blockchain",
      icon: "🚀",
    },
  ];

  const handleCreateWalletClick = (e) => {
    e.preventDefault();
    const createWalletSection = document.getElementById("wallet-creation");
    if (createWalletSection) {
      createWalletSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Secure</span> Your Organization's
            Assets with
            <br />
            Multi-Signature Wallet
          </h1>

          <div className="hero-features">
            <div className="feature">
              <div className="feature-icon">🔐</div>
              <h3>Enhanced Security</h3>
              <p>Multiple signatures required for transactions</p>
            </div>

            <div className="feature">
              <div className="feature-icon">👥</div>
              <h3>Team Management</h3>
              <p>Perfect for teams and organizations</p>
            </div>

            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Efficient</h3>
              <p>Quick transaction processing</p>
            </div>
          </div>

          <div className="hero-description">
            <p className="description-text">
              Take control of your digital assets with this MultiSig wallet.
              Require multiple approvals for enhanced security and team
              coordination.
            </p>
          </div>

          <div className="cta-buttons">
            <Link to="/wallets" className="cta-button primary">
              View Wallets
            </Link>
            <a
              href="#create"
              onClick={handleCreateWalletClick}
              className="cta-button secondary"
            >
              Create Wallet
            </a>
          </div>
        </div>
      </div>

      <div className="how-it-works" id="create">
        <div className="section-content">
          <h2 className="section-title">How to Create Your MultiSig Wallet</h2>
          <p className="section-subtitle">
            Follow these simple steps to set up your secure wallet
          </p>

          <div className="steps-container">
            {steps.map((step, index) => (
              <div className="step-card" key={index}>
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="create-wallet-section">
            <h3 className="ready-title">Ready to Get Started?</h3>
            <p className="ready-description">
              Create your MultiSig wallet now and enhance your asset security
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
