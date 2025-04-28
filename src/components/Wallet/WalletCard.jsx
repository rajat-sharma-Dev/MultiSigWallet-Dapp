import React from "react";
import { useNavigate } from "react-router-dom";

const WalletCard = ({ walletAddress, numOwners, isCreator }) => {
  const navigate = useNavigate();

  const handleEnterWallet = () => {
    navigate(`/wallets/${walletAddress}`);
  };

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        color: "white",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Wallet Address:</h3>
      <p
        style={{
          wordBreak: "break-all",
          fontFamily: "monospace",
          marginBottom: "15px",
        }}
      >
        {walletAddress}
      </p>
      <p style={{ marginBottom: "15px" }}>Number of Owners: {numOwners}</p>
      {isCreator && (
        <p style={{ marginBottom: "15px", color: "#646cff" }}>
          You created this wallet
        </p>
      )}
      <button
        onClick={handleEnterWallet}
        style={{
          padding: "10px 20px",
          backgroundColor: "#646cff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Enter Wallet
      </button>
    </div>
  );
};

export default WalletCard;
