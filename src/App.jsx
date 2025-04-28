// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CreateWallet from "./components/CreateWallet/CreateWallet";
import Wallet from "./components/Wallet/Wallet";
import WalletInteraction from "./components/Wallet/WalletInteraction";
import Contact from "./components/Contact/Contact";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Hero />
                <div id="wallet-creation">
                  <CreateWallet />
                </div>
                <About />
              </div>
            }
          />
          <Route path="/wallets" element={<Wallet />} />
          <Route
            path="/wallets/:walletAddress"
            element={<WalletInteraction />}
          />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
