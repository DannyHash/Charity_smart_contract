"use client";

import { useState } from "react";

import Web3 from "web3";
import charityContractABI from "../donate/charityContractABI.json";

const contractAddress = "0x9c576F74d92Bd506d8be7312BEe88bBbbAB9D6c6";

const LogExpense = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleLogExpense = async (e) => {
    e.preventDefault();

    const web3 = new Web3(window.ethereum);

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const charityContract = new web3.eth.Contract(
      charityContractABI,
      contractAddress
    );

    try {
      const amountInWei = web3.utils.toWei(amount, "ether");
      const accounts = await web3.eth.getAccounts();

      await charityContract.methods
        .logExpense(amountInWei, description)
        .send({ from: accounts[0] });

      setStatusMessage("Expense logged successfully!");
    } catch (error) {
      console.error("Error logging expense:", error);
      setStatusMessage("Failed to log expense. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Log an Expense</h1>
      <form onSubmit={handleLogExpense} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-lg font-medium">
            Expense Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
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
          Log Expense
        </button>
      </form>

      {statusMessage && <p className="mt-4 text-green-600">{statusMessage}</p>}
    </div>
  );
};

export default LogExpense;
