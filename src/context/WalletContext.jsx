import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("");

  // Auto-connect if previously connected
  useEffect(() => {
    if (window.ethereum && localStorage.getItem("walletConnected") === "true") {
      connectWallet();
    }
    // eslint-disable-next-line
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed. Please install MetaMask.");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const userSigner = await web3Provider.getSigner();
      const userAddress = await userSigner.getAddress();
      const networkObj = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(userSigner);
      setAddress(userAddress);
      setNetwork(networkObj.name);

      localStorage.setItem("walletConnected", "true");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("There was an error connecting to your wallet. Please try again.");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress("");
    setNetwork("");
    localStorage.removeItem("walletConnected");
  };

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        address,
        network,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
