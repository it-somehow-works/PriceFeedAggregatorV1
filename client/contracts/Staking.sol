//SPDX-License-Identifier: UNLICENSED


// StakingContract.sol
pragma solidity ^0.8.0;

contract Staking {

    // Mapping of user's to their staked ETH.
    mapping(address => uint256) private stakedBalances;
    address public owner;

    // Set the owner to be the deployer.
    constructor() {
        owner = msg.sender;
    }

    // User can stake ETH.
    function deposit() external payable {
        require(msg.value > 0, "User must stake amount greater than 0");
        stakedBalances[msg.sender] += msg.value;
    }

    // Function to withdraw ETH
    function withdraw(uint256 amount) external payable {
        require(amount > 0, "User amount to withdraw must be greater than 0");
        require(stakedBalances[msg.sender] >= amount, "Insufficient staked balance");   
        // Reduce the users balance.
        stakedBalances[msg.sender] -= amount;
        // Make the actual ETH transfer to the user.
        payable(msg.sender).transfer(amount);
    }

    // Function to see the staked amount for a specific user.
    function getStakedAmount(address user) external view returns(uint256) {
        return stakedBalances[user];
    }
}
