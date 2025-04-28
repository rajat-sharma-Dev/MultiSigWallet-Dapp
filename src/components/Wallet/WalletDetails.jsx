import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useWallet } from "../../context/WalletContext";
import MultiSigWalletFactory from "../../context/MultiSigWalletFactory.json";

const WalletDetails = () => {
  const { walletAddress } = useParams();
  const navigate = useNavigate();
  const { address, signer } = useWallet();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactionForm, setTransactionForm] = useState({
    to: "",
    value: "",
    data: "0x",
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        if (!signer || !address) {
          setError("Please connect your wallet first");
          setLoading(false);
          return;
        }

        const walletContract = new ethers.Contract(
          walletAddress,
          MultiSigWalletFactory.abi,
          signer
        );

        const owners = await walletContract.getOwners();
        const requiredConfirmations = await walletContract.required();
        const isOwner = owners.includes(address);

        if (!isOwner) {
          setError("You are not an owner of this wallet");
          setLoading(false);
          return;
        }

        setWallet({
          address: walletAddress,
          owners,
          requiredConfirmations,
          isOwner,
        });

        // Fetch transactions
        const transactionCount = await walletContract.getTransactionCount();
        const txList = [];

        for (let i = 0; i < transactionCount; i++) {
          const tx = await walletContract.transactions(i);
          const isConfirmed = await walletContract.isConfirmed(i, address);
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

        setTransactions(txList);
        setError("");
      } catch (error) {
        console.error("Error fetching wallet details:", error);
        setError("Failed to fetch wallet details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletDetails();
  }, [walletAddress, address, signer]);

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    try {
      const walletContract = new ethers.Contract(
        walletAddress,
        MultiSigWalletFactory.abi,
        signer
      );

      const tx = await walletContract.submitTransaction(
        transactionForm.to,
        ethers.parseEther(transactionForm.value),
        transactionForm.data
      );
      await tx.wait();

      // Refresh transactions
      const transactionCount = await walletContract.getTransactionCount();
      const newTx = await walletContract.transactions(transactionCount - 1);
      setTransactions([
        ...transactions,
        {
          id: transactionCount - 1,
          to: newTx.to,
          value: newTx.value.toString(),
          data: newTx.data,
          executed: newTx.executed,
          numConfirmations: newTx.numConfirmations,
          isConfirmed: false,
        },
      ]);

      setTransactionForm({
        to: "",
        value: "",
        data: "0x",
      });
    } catch (error) {
      console.error("Error submitting transaction:", error);
      setError("Failed to submit transaction. Please try again.");
    }
  };

  const handleConfirmTransaction = async (txId) => {
    try {
      const walletContract = new ethers.Contract(
        walletAddress,
        MultiSigWalletFactory.abi,
        signer
      );

      const tx = await walletContract.confirmTransaction(txId);
      await tx.wait();

      // Update transaction confirmation status
      setTransactions(
        transactions.map((tx) => {
          if (tx.id === txId) {
            return {
              ...tx,
              isConfirmed: true,
              numConfirmations: tx.numConfirmations + 1,
            };
          }
          return tx;
        })
      );
    } catch (error) {
      console.error("Error confirming transaction:", error);
      setError("Failed to confirm transaction. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading wallet details...</p>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/wallet")}>Back to Wallets</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Wallet Details</h2>
      <p>Address: {walletAddress}</p>
      <p>Required Confirmations: {wallet?.requiredConfirmations}</p>
      <p>Owners: {wallet?.owners.length}</p>

      <div style={{ marginTop: "30px" }}>
        <h3>Submit New Transaction</h3>
        <form onSubmit={handleSubmitTransaction}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              To Address:
            </label>
            <input
              type="text"
              value={transactionForm.to}
              onChange={(e) =>
                setTransactionForm({ ...transactionForm, to: e.target.value })
              }
              style={{
                padding: "8px",
                width: "100%",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Value (ETH):
            </label>
            <input
              type="text"
              value={transactionForm.value}
              onChange={(e) =>
                setTransactionForm({
                  ...transactionForm,
                  value: e.target.value,
                })
              }
              style={{
                padding: "8px",
                width: "100%",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#646cff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Submit Transaction
          </button>
        </form>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Pending Transactions</h3>
        {transactions.length === 0 ? (
          <p>No pending transactions</p>
        ) : (
          <div>
            {transactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  backgroundColor: "#1a1a1a",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  color: "white",
                }}
              >
                <p>ID: {tx.id}</p>
                <p>To: {tx.to}</p>
                <p>Value: {ethers.formatEther(tx.value)} ETH</p>
                <p>Confirmations: {tx.numConfirmations}</p>
                <p>Status: {tx.executed ? "Executed" : "Pending"}</p>
                {!tx.executed && !tx.isConfirmed && (
                  <button
                    onClick={() => handleConfirmTransaction(tx.id)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#646cff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  >
                    Confirm Transaction
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletDetails;
