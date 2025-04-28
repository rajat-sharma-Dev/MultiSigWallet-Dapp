import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";
import { ethers } from "ethers";
import MultiSigWallet from "../../context/MultiSigWallet.json";
import "./WalletInteraction.css";

const WalletInteraction = () => {
  const { walletAddress } = useParams();
  const { provider, signer, address } = useWallet();
  const [wallet, setWallet] = useState(null);
  const [owners, setOwners] = useState([]);
  const [required, setRequired] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    to: "",
    value: "",
    data: "",
  });

  const refreshTransactions = async (contract) => {
    try {
      const transactionCount = await contract.getTransactionCount();
      console.log("Transaction count:", transactionCount.toString()); // Debug log

      const txList = [];
      for (let i = 0; i < transactionCount; i++) {
        const tx = await contract.transactions(i);
        const isConfirmed = await contract.isConfirmed(i, address);
        txList.push({
          id: i,
          to: tx.to,
          value: tx.value.toString(),
          data: tx.data,
          executed: tx.executed,
          numConfirmations: tx.numConfirmations,
          isConfirmed,
        });
      }
      console.log("Fetched transactions:", txList); // Debug log
      setTransactions(txList);
    } catch (err) {
      console.error("Error refreshing transactions:", err);
      setError("Failed to load transactions: " + err.message);
    }
  };

  useEffect(() => {
    const initializeWallet = async () => {
      console.log("Initializing wallet..."); // Debug log
      if (!provider || !signer) {
        console.log("No provider or signer"); // Debug log
        setLoading(false);
        return;
      }

      try {
        console.log("Creating contract instance..."); // Debug log
        const contract = new ethers.Contract(
          walletAddress,
          MultiSigWallet.abi,
          signer
        );

        // Set wallet first
        setWallet(contract);

        // Get wallet details
        console.log("Fetching wallet details..."); // Debug log
        const [ownersList, requiredConfirmations] = await Promise.all([
          contract.getOwners(),
          contract.requiredConfirmations(),
        ]);

        // Check if current user is an owner
        const userIsOwner = ownersList.some(
          (owner) => owner.toLowerCase() === address?.toLowerCase()
        );

        // Update state
        setOwners(ownersList);
        setRequired(requiredConfirmations);
        setIsOwner(userIsOwner);

        // Fetch transactions
        console.log("Fetching transactions..."); // Debug log
        await refreshTransactions(contract);

        setError("");
      } catch (err) {
        console.error("Error initializing wallet:", err);
        setError("Failed to initialize wallet: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeWallet();
  }, [provider, signer, walletAddress, address]);

  const handleSubmitTransaction = async () => {
    if (!wallet || !newTransaction.to || !newTransaction.value) return;
    setLoading(true);
    setError("");

    try {
      if (!ethers.isAddress(newTransaction.to)) {
        throw new Error("Invalid recipient address");
      }

      const valueInWei = ethers.parseEther(newTransaction.value);
      const tx = await wallet.submitTransaction(
        newTransaction.to,
        valueInWei,
        newTransaction.data || "0x"
      );
      await tx.wait();

      await refreshTransactions(wallet);
      setNewTransaction({ to: "", value: "", data: "" });
    } catch (err) {
      console.error("Error submitting transaction:", err);
      setError("Failed to submit transaction: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTransaction = async (txId) => {
    if (!wallet) return;
    setLoading(true);
    setError("");

    try {
      const tx = await wallet.confirmTransaction(txId);
      await tx.wait();
      await refreshTransactions(wallet);
    } catch (err) {
      console.error("Error confirming transaction:", err);
      setError("Failed to confirm transaction: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeTransaction = async (txId) => {
    if (!wallet) return;
    setLoading(true);
    setError("");

    try {
      const tx = await wallet.revokeConfirmation(txId);
      await tx.wait();
      await refreshTransactions(wallet);
    } catch (err) {
      console.error("Error revoking transaction:", err);
      setError("Failed to revoke confirmation: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTransaction = async (txId) => {
    if (!wallet) return;
    setLoading(true);
    setError("");

    try {
      const tx = await wallet.executeTransaction(txId);
      await tx.wait();
      await refreshTransactions(wallet);
    } catch (err) {
      console.error("Error executing transaction:", err);
      setError("Failed to execute transaction: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="wallet-interaction">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="wallet-interaction">
        <div className="error-message">
          Unable to load wallet. Please check your connection and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-interaction">
      <div className="wallet-header">
        <h2>Wallet Interaction</h2>
        <div className="wallet-address-display">{walletAddress}</div>
      </div>

      <div className="owners-section">
        <h3>Owners</h3>
        <ul className="owners-list">
          {owners.map((owner, index) => (
            <li key={index} className="owner-item">
              <span className="transaction-address">{owner}</span>
              {owner.toLowerCase() === address?.toLowerCase() && (
                <span className="owner-badge">You</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="required-confirmations">
        <h3>Required Confirmations</h3>
        <p>{required.toString()}</p>
      </div>

      {isOwner && (
        <div className="transaction-form">
          <h3>Submit New Transaction</h3>
          <div className="form-group">
            <input
              type="text"
              value={newTransaction.to}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, to: e.target.value })
              }
              placeholder="Recipient address"
              className="input-field"
            />
            <input
              type="text"
              value={newTransaction.value}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, value: e.target.value })
              }
              placeholder="Amount in ETH"
              className="input-field"
            />
            <button
              onClick={handleSubmitTransaction}
              disabled={loading}
              className="btn btn-confirm"
            >
              Submit Transaction
            </button>
          </div>
        </div>
      )}

      <div className="transactions-list">
        <h3>Transactions</h3>
        {transactions.length === 0 ? (
          <p>No transactions</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="transaction-card">
              <div className="transaction-header">
                <span className="transaction-id">Transaction ID: {tx.id}</span>
                <span
                  className={`transaction-status ${
                    tx.executed ? "status-executed" : "status-pending"
                  }`}
                >
                  {tx.executed ? "Executed" : "Pending"}
                </span>
              </div>

              <div className="transaction-details">
                <p>
                  To: <span className="transaction-address">{tx.to}</span>
                </p>
                <p>
                  Value:{" "}
                  <span className="transaction-value">
                    {ethers.formatEther(tx.value)} ETH
                  </span>
                </p>
                <p className="transaction-confirmations">
                  Confirmations: {tx.numConfirmations.toString()}
                </p>
              </div>

              {!tx.executed && isOwner && (
                <div className="transaction-actions">
                  {!tx.isConfirmed ? (
                    <button
                      onClick={() => handleConfirmTransaction(tx.id)}
                      disabled={loading}
                      className="btn btn-confirm"
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRevokeTransaction(tx.id)}
                      disabled={loading}
                      className="btn btn-revoke"
                    >
                      Revoke
                    </button>
                  )}
                  {tx.numConfirmations >= required && (
                    <button
                      onClick={() => handleExecuteTransaction(tx.id)}
                      disabled={loading}
                      className="btn btn-execute"
                    >
                      Execute
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default WalletInteraction;
