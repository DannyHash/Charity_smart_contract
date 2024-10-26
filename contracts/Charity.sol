// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Charity is Ownable {
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string purpose; // Purpose of the donation
        string acknowledgment; // Acknowledgment message for the donor
    }

    struct Expense {
        uint256 amount;
        string description;
        uint256 timestamp; // When the expense was logged
    }

    Expense[] public expenses;
    Donation[] public donations;
    uint256 public totalDonations;
    address public charityAddress;
    uint256 public minDonation = 0.01 ether; // Minimum donation limit
    uint256 public maxDonation = 10 ether; // Maximum donation limit
    bool public isPaused = false;

    event Donated(address indexed donor, uint256 amount, uint256 timestamp, string purpose);
    event Withdrawn(uint256 amount);
    event ExpenseLogged(uint256 amount, string description, uint256 timestamp);

    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    constructor(address _charityAddress) Ownable(msg.sender) {
        charityAddress = _charityAddress;
     }

    function setCharityAddress(address _newAddress) external onlyOwner {
        charityAddress = _newAddress;
    }

    // Pause the contract in case of emergencies
    function pause() external onlyOwner {
        isPaused = true;
    }

    // Unpause the contract
    function unPause() external onlyOwner {
        isPaused = false;
    }

    function donate(string calldata purpose) external payable whenNotPaused{
        require(msg.value >= minDonation, "Donation is below the minimum limit");
        require(msg.value <= maxDonation, "Donation is above the maximum limit");

        // Create acknowledgment message
        string memory acknowledgment = string(abi.encodePacked("Thank you for your donation of", uint2str(msg.value), "wei for the purpose:", purpose));

        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            purpose: purpose,
            acknowledgment: acknowledgment
        }));

        totalDonations += msg.value;

        emit Donated(msg.sender, msg.value, block.timestamp, purpose);
    }

    function getDonationCount() external view returns (uint256) {
        return donations.length;
    }

    function getDonations() external view returns (Donation[] memory) {
        return donations;
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(charityAddress).transfer(amount);
        emit Withdrawn(amount);
    }

      function withdrawAll() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");
        payable(charityAddress).transfer(amount);
        emit Withdrawn(amount);
    }

    // Log an expense
    function logExpense(uint256 amount, string calldata description) external onlyOwner {
        require(amount > 0, "Expense amount must be greater than 0");
        require(address(this).balance > amount, "Insufficient balance for expense");

        expenses.push(Expense({
            amount: amount,
            description: description,
            timestamp: block.timestamp
        }));

        emit ExpenseLogged(amount, description, block.timestamp);
    }

    // Get expense details
    function getExpenses() external view returns (Expense[] memory) {
        return expenses;
    }

     // Helper function to convert uint256 to string
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if(_i == 0) return "0";
        uint256 j = _i;
        uint length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (_i != 0) {
            bstr[--k] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}