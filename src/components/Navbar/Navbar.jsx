import React from "react";
import { useWallet } from "../../context/WalletContext";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { address, network, connectWallet, disconnectWallet } = useWallet();
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        MultiSig Wallet DApp
      </Link>

      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link
          to="/wallets"
          className={`nav-link ${
            location.pathname === "/wallets" ? "active" : ""
          }`}
        >
          Wallets
        </Link>
        <Link
          to="/contact"
          className={`nav-link ${
            location.pathname === "/contact" ? "active" : ""
          }`}
        >
          Contact
        </Link>
      </div>

      <div className="wallet-info">
        {address ? (
          <>
            <span className="network-badge">
              {network ? network : "Unknown Network"}
            </span>
            <span className="wallet-address">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <button onClick={disconnectWallet} className="disconnect-button">
              Disconnect
            </button>
          </>
        ) : (
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
