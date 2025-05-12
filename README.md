# 🧾 MultiSig Wallet DApp

A decentralized multi-signature wallet built with Solidity and React, allowing multiple owners to securely manage shared funds. Inspired by Gnosis Safe, this DApp ensures that no single party can move assets unilaterally — transactions require confirmation from a minimum number of designated owners.

Tri it now :- > https://multi-sig-wallet-dapp.vercel.app


## 🌐 Overview

This MultiSig Wallet allows users to:
- Deploy shared wallets via a factory contract
- Set custom confirmation thresholds
- Propose, approve, and execute transactions collaboratively
- Discover wallets linked to their addresses

The smart contracts are written in Solidity, and the frontend is built using React, Vite, and Ethers.js.

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React.js, Vite, Ethers.js
- **Wallet Integration**: MetaMask
- **Frameworks/Tools**: Hardhat, Ethers, JavaScript

## ✨ Features

- 🔨 **Factory Contract**: Create new MultiSig wallets dynamically using `MultiSigWalletFactory`.
- 👥 **Multiple Owners**: Deploy wallets with 1 to N owners.
- ✅ **Custom Confirmation Thresholds**: Define how many confirmations are required to execute a transaction.
- 🔎 **Wallet Discovery**: View all deployed MultiSig wallets associated with your address.
- 🔐 **Secure Execution**: Transactions are only executed when the required number of approvals is met.
- 📦 **Modular Design**: Easy to extend for use in DAO treasury or shared custody use cases.

## 🧪 How It Works

1. **Deploy Wallet**: Use the frontend or interact with `MultiSigWalletFactory` to deploy a wallet.
2. **Submit Transaction**: One of the owners can submit a transaction proposal.
3. **Confirm Transaction**: Other owners confirm the transaction.
4. **Execute Transaction**: Once enough confirmations are collected, the transaction can be executed.
