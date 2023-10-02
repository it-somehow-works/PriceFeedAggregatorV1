//SPDX-License-Identifier: UNLICENSED


// StakingContract.sol
pragma solidity ^0.8.0;

contract Staking {
    address owner;

    // Constructor without parameters
    constructor() {
        owner = msg.sender;
    }
}
