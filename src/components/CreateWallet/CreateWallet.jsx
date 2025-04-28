import React, { useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../context/WalletContext";
import MultiSigWalletFactory from "../../context/MultiSigWalletFactory.json";
import "./CreateWallet.css";

const CreateWallet = () => {
  const { address, signer } = useWallet();
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    approvers: "",
    approverAddresses: [""],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "approvers") {
      // When number of approvers changes, update the approverAddresses array
      const numApprovers = parseInt(value) || 0;
      const newAddresses = Array(numApprovers).fill("");
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        approverAddresses: newAddresses,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleApproverAddressChange = (index, value) => {
    setFormData((prev) => {
      const newAddresses = [...prev.approverAddresses];
      newAddresses[index] = value;
      return {
        ...prev,
        approverAddresses: newAddresses,
      };
    });
  };

  const calculateRequiredConfirmations = () => {
    const numApprovers = parseInt(formData.approvers) || 0;
    return Math.ceil((numApprovers + 1) / 2);
  };

  const validateForm = () => {
    const approvers = parseInt(formData.approvers);

    if (isNaN(approvers) || approvers < 1) {
      setError("Number of approvers must be at least 1");
      return false;
    }

    // Validate approver addresses
    const invalidAddresses = formData.approverAddresses.some((addr) => {
      try {
        return !ethers.isAddress(addr) && addr !== "";
      } catch {
        return true;
      }
    });

    if (invalidAddresses) {
      setError("One or more approver addresses are invalid");
      return false;
    }

    // Check for duplicate addresses
    const allAddresses = [...formData.approverAddresses, address].map((addr) =>
      addr.toLowerCase()
    );
    const uniqueAddresses = new Set(allAddresses);
    if (uniqueAddresses.size < allAddresses.length) {
      setError("Duplicate addresses are not allowed");
      return false;
    }

    return true;
  };

  const createNewWallet = async () => {
    try {
      if (!signer) {
        setError("Please connect your wallet first");
        return;
      }

      if (!validateForm()) {
        return;
      }

      setLoading(true);
      setError("");

      // Factory contract address
      const factoryAddress = "0xc1F8a4B3F527d7B120C8EaF4A701d3dFebb9f81F";

      // Create contract instance
      const factoryContract = new ethers.Contract(
        factoryAddress,
        MultiSigWalletFactory.abi,
        signer
      );

      // Filter out empty addresses and add owner's address
      const owners = [
        ...formData.approverAddresses.filter((addr) => addr !== ""),
        address,
      ];
      const requiredConfirmations = calculateRequiredConfirmations();

      // Call createWallet function
      const tx = await factoryContract.createWallet(
        owners,
        requiredConfirmations
      );
      const txReceipt = await tx.wait();

      // Get the contract interface
      const iface = factoryContract.interface;

      // Find the WalletCreated event log
      const eventLog = txReceipt.logs.find((log) => {
        try {
          const parsedLog = iface.parseLog(log);
          return parsedLog && parsedLog.name === "WalletCreated";
        } catch {
          return false;
        }
      });

      if (!eventLog) {
        throw new Error("WalletCreated event not found in transaction receipt");
      }

      // Parse the event log
      const parsedLog = iface.parseLog(eventLog);
      const newWalletAddress = parsedLog.args.walletAddress;

      setWalletAddress(newWalletAddress);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating wallet:", error);
      setError("There was an error creating the wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-wallet-container">
      <h2 className="create-wallet-title">Create New MultiSig Wallet</h2>

      {error && <div className="create-wallet-error">{error}</div>}

      {!showForm && !walletAddress && (
        <button
          onClick={() => setShowForm(true)}
          disabled={loading || !address}
          className="create-wallet-button"
        >
          {address ? "Create New Wallet" : "Connect Wallet to Continue"}
        </button>
      )}

      {showForm && !walletAddress && (
        <div className="create-wallet-form">
          <div className="form-section">
            <label className="form-label">
              Number of Additional Approvers:
            </label>
            <input
              type="number"
              name="approvers"
              value={formData.approvers}
              onChange={handleInputChange}
              min="1"
              className="form-input"
            />
            <p className="form-helper-text">
              Note: You will be automatically added as an owner
            </p>
          </div>

          {parseInt(formData.approvers) > 0 && (
            <div className="form-section">
              <label className="form-label">Approver Addresses:</label>
              {formData.approverAddresses.map((address, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Approver ${index + 1} Address`}
                  value={address}
                  onChange={(e) =>
                    handleApproverAddressChange(index, e.target.value)
                  }
                  className="form-input"
                />
              ))}
            </div>
          )}

          <div className="configuration-summary">
            <p className="summary-title">Configuration Summary:</p>
            <p className="summary-text">
              Total Approvers: {parseInt(formData.approvers) + 1} (including
              you)
            </p>
            <p className="summary-text">
              Required Confirmations: {calculateRequiredConfirmations()}
            </p>
          </div>

          <div className="button-group">
            <button
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
              className="create-wallet-button"
              style={{ backgroundColor: "#2c2c2c" }}
            >
              Cancel
            </button>
            <button
              onClick={createNewWallet}
              disabled={loading}
              className="create-wallet-button"
            >
              {loading ? "Creating..." : "Create Wallet"}
            </button>
          </div>
        </div>
      )}

      {walletAddress && (
        <div className="success-container">
          <h3 className="success-title">Wallet Created Successfully!</h3>
          <p className="success-text">Your new MultiSig wallet address:</p>
          <div className="wallet-address">{walletAddress}</div>
        </div>
      )}
    </div>
  );
};

export default CreateWallet;
