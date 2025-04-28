import React from "react";
import { FaGithub, FaCode, FaEthereum, FaShieldAlt } from "react-icons/fa";
import "./About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-content">
        <h2 className="about-title">About MultiSig Wallet DApp</h2>

        <div className="about-grid">
          <div className="about-card">
            <div className="card-icon">
              <FaEthereum />
            </div>
            <h3>Smart Contract Technology</h3>
            <p>
              Built on Ethereum blockchain using Solidity smart contracts,
              ensuring secure and transparent multi-signature functionality for
              your digital assets.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">
              <FaShieldAlt />
            </div>
            <h3>Enhanced Security</h3>
            <p>
              Multiple signature requirements prevent unauthorized transactions,
              protecting your assets with distributed authorization control.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">
              <FaCode />
            </div>
            <h3>Modern Tech Stack</h3>
            <p>
              Developed using React, Ethers.js, and Web3 technologies to provide
              a seamless and responsive user experience.
            </p>
          </div>
        </div>

        <div className="tech-stack">
          <h3>Built With</h3>
          <div className="tech-tags">
            <span className="tech-tag">React</span>
            <span className="tech-tag">Solidity</span>
            <span className="tech-tag">Ethers.js</span>
            <span className="tech-tag">Web3</span>
            <span className="tech-tag">Vite</span>
          </div>
        </div>

        <div className="github-section">
          <h3>Open Source</h3>
          <p>
            This project is open source and available on GitHub. Feel free to
            contribute or use it as a reference for your own projects.
          </p>
          <a
            href="https://github.com/rajat-sharma-Dev/MultiSigWallet-Dapp"
            target="_blank"
            rel="noopener noreferrer"
            className="github-button"
          >
            <FaGithub /> View on GitHub
          </a>
        </div>

        <div className="workflow-section">
          <h3>How It Works</h3>
          <div className="workflow-steps">
            <div className="workflow-step">
              <span className="step-marker">1</span>
              <h4>Create Wallet</h4>
              <p>
                Deploy a new MultiSig wallet by specifying owners and required
                confirmations
              </p>
            </div>
            <div className="workflow-step">
              <span className="step-marker">2</span>
              <h4>Submit Transaction</h4>
              <p>Any owner can submit a transaction proposal to the wallet</p>
            </div>
            <div className="workflow-step">
              <span className="step-marker">3</span>
              <h4>Gather Confirmations</h4>
              <p>Other owners review and confirm the transaction</p>
            </div>
            <div className="workflow-step">
              <span className="step-marker">4</span>
              <h4>Execute Transaction</h4>
              <p>
                Once enough confirmations are received, the transaction can be
                executed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
