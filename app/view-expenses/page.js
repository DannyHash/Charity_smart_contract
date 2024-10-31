"use client";

import { useEffect, useState } from "react";
import Web3 from "web3";
import charityContractABI from "../donate/charityContractABI.json";

const contractAddress = "0x9c576F74d92Bd506d8be7312BEe88bBbbAB9D6c6";

export default function ViewExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const charityContract = new web3.eth.Contract(
          charityContractABI,
          contractAddress
        );

        const expensesFromContract = await charityContract.methods
          .getExpenses()
          .call();
        setExpenses(expensesFromContract);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setStatusMessage("Failed to fetch expenses. Please try again.");
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Logged Expenses</h1>
      {statusMessage && <p className="text-red-500">{statusMessage}</p>}
      <ul className="space-y-4">
        {expenses.map((expense, index) => (
          <li key={index} className="p-4 bg-white rounded-lg shadow">
            <p>
              <strong>Amount:</strong>{" "}
              {Web3.utils.fromWei(expense.amount, "ether")} Ether
            </p>
            <p>
              <strong>Description:</strong> {expense.description}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(Number(expense.timestamp) * 1000).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
