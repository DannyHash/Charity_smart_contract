"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import charityContractABI from "../donate/charityContractABI.json";

export default function ViewDonations() {
  const [donations, setDonations] = useState([]);
  const [web3, setWeb3] = useState(null);

  const contractAddress = "0x9c576F74d92Bd506d8be7312BEe88bBbbAB9D6c6";

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWeb3(web3Instance);

      // Fetch donations from the contract
      fetchDonations(web3Instance);
    } else {
      alert("Please install Metamask to use this feature.");
    }
  };

  const fetchDonations = async (web3Instance) => {
    const charityContract = new web3Instance.eth.Contract(
      charityContractABI,
      contractAddress
    );

    try {
      const donationCount = await charityContract.methods
        .getDonationCount()
        .call();
      const donationsList = [];

      for (let i = 0; i < donationCount; i++) {
        const donation = await charityContract.methods.donations(i).call();
        donationsList.push(donation);
      }

      setDonations(donationsList);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">View Donations</h1>
      <div className="space-y-4">
        {donations.map((donation, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow">
            <p>
              <strong>Donor Address:</strong> {donation.donor}
            </p>
            <p>
              <strong>Amount:</strong>{" "}
              {web3.utils.fromWei(donation.amount, "ether")} ETH
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(Number(donation.timestamp) * 1000).toLocaleString()}
            </p>
            <p>
              <strong>Purpose:</strong> {donation.purpose}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
