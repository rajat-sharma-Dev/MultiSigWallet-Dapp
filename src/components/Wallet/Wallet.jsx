import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../context/WalletContext";
import MultiSigWalletFactory from "../../context/MultiSigWalletFactory.json";
import MultiSigWallet from "../../context/MultiSigWallet.json";
import WalletCard from "./WalletCard";
import { FaWallet, FaSpinner } from "react-icons/fa";
import "./Wallet.css";

const Wallet = () => {
  const { address, signer } = useWallet();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWallets = async () => {
      if (!signer || !address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Factory contract address
        const factoryAddress = "0xc1F8a4B3F527d7B120C8EaF4A701d3dFebb9f81F";

        // Create contract instances
        const factoryContract = new ethers.Contract(
          factoryAddress,
          MultiSigWalletFactory.abi,
          signer
        );

        // Get all wallets created by the user
        const createdWallets = await factoryContract.getUserWallets(address);

        // Get all wallets from the factory
        const allWallets = await factoryContract.getAllWallets();

        // For each wallet, check if the user is an owner
        const walletDetails = await Promise.all(
          allWallets.map(async (walletAddress) => {
            const walletContract = new ethers.Contract(
              walletAddress,
              MultiSigWallet.abi,
              signer
            );
            const owners = await walletContract.getOwners();
            const isOwner = owners.some(
              (owner) => owner.toLowerCase() === address.toLowerCase()
            );

            if (isOwner) {
              return {
                address: walletAddress,
                numOwners: owners.length,
                isCreator: createdWallets.some(
                  (created) =>
                    created.toLowerCase() === walletAddress.toLowerCase()
                ),
              };
            }
            return null;
          })
        );

        // Filter out null values and set the wallets
        setWallets(walletDetails.filter((wallet) => wallet !== null));
        setError("");
      } catch (error) {
        console.error("Error fetching wallets:", error);
        setError("Failed to fetch wallets. Please try again.");
        setWallets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [address, signer]);

  if (!address || !signer) {
    return (
      <div className="wallet-container">
        <div className="wallet-disconnected">
          <div className="wallet-icon">
            <FaWallet />
          </div>
          <h2>Connect Your Wallet</h2>
          <p>
            Please connect your wallet to view and manage your MultiSig wallets
          </p>
          <div className="features-grid">
            <div className="feature-item">
              <h3>View Your Wallets</h3>
              <p>Access all MultiSig wallets where you are an owner</p>
            </div>
            <div className="feature-item">
              <h3>Manage Transactions</h3>
              <p>Submit and confirm transactions with other owners</p>
            </div>
            <div className="feature-item">
              <h3>Track Activity</h3>
              <p>Monitor all wallet activities and confirmations</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wallet-container">
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading your wallets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h2>Your MultiSig Wallets</h2>
        <p className="wallet-subtitle">
          Manage and monitor your MultiSig wallets
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="wallets-grid">
        {wallets.length === 0 ? (
          <div className="no-wallets">
            <div className="wallet-icon">
              <FaWallet />
            </div>
            <h3>No Wallets Found</h3>
            <p>You are not part of any MultiSig wallets yet.</p>
            <a href="/#create" className="create-wallet-link">
              Create Your First Wallet
            </a>
          </div>
        ) : (
          wallets.map((wallet) => (
            <WalletCard
              key={wallet.address}
              walletAddress={wallet.address}
              numOwners={wallet.numOwners}
              isCreator={wallet.isCreator}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Wallet;
