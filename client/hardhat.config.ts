//require('hardhat')
//require('hardhat-deploy')
//require('hardhat-deploy-ethers')
require('@nomicfoundation/hardhat-toolbox')

require('@nomiclabs/hardhat-ethers')

require('dotenv').config()

const { HardhatUserConfig } = require("hardhat/config");

const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = "YOUR SEPOLIA PRIVATE KEY";

const config = {
    networks: {
        hardhat: {
            chainId: 1337,
        },
        localhost: {
            url: "http://localhost:8545",
        },
    },
    solidity: "0.8.19",
    //To push onto live network uncomment below and comment above make sure to use a test net private key with no real ETH.
    //networks: {
    //    sepolia: {
    //        url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    //        accounts: [SEPOLIA_PRIVATE_KEY]
    //    }
    //}
    // @ts-ignore: Ignore TypeScript error for namedAccounts
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
};

newFunction();

function newFunction() {
    module.exports = config;
}
