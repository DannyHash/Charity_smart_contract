"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import charityContractABI from "../donate/charityContractABI.json";

export default function Donate() {
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  const contractAddress = "0x9c576F74d92Bd506d8be7312BEe88bBbbAB9D6c6";

  useEffect(() => {
    initializeWeb3(); // Call initialize on component mount
  }, []);

  // Initialize Web3 and connect to Metamask
  const initializeWeb3 = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } else {
      alert("Please install Metamask to use this feature.");
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    // Handle the donation logic here
    if (!web3 || !account) {
      alert("Web3 is not initialized. Please connect to Metamask.");
      return;
    }

    try {
      // Convert amount from Ether to Wei
      const amountInWei = web3.utils.toWei(amount, "ether");

      const charityContract = new web3.eth.Contract(
        charityContractABI,
        contractAddress
      );

      await charityContract.methods.donate(purpose).send({
        from: account,
        value: amountInWei,
      });

      alert("Donation successful!");
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Failed to donate. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Make a Donation</h1>
      <form onSubmit={handleDonation} className="space-y-4">
        <div>
          <label htmlFor="purpose" className="block text-lg font-medium">
            Purpose of Donation
          </label>
          <input
            type="text"
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Purpose"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-lg font-medium">
            Amount (in Ether)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
        >
          Donate
        </button>
      </form>
    </div>
  );
}
