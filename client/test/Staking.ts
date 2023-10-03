// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers: otherEthers } = require("ethers");  // Alias ethers as otherEthers


// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("Staking contract", function () {
    // We define a fixture to reuse the same setup in every test. We use
    // loadFixture to run this setup once, snapshot that state, and reset Hardhat
    // Network to that snapshot in every test.
    async function deployStakingFixture() {
        // Get the Signers here.
        // NOTE using the providers ethers here, which can't be used for parseEth.
        const [owner, addr1, addr2] = await ethers.getSigners();

        // To deploy our contract, we just have to call ethers.deployContract and await
        // its waitForDeployment() method, which happens once its transaction has been
        // mined.
        const hardhatStaking = await ethers.deployContract("Staking");

        await hardhatStaking.waitForDeployment();

        // Fixtures can return anything you consider useful for your tests
        return { hardhatStaking, owner, addr1, addr2 };
    }

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        // `it` is another Mocha function. This is the one you use to define each
        // of your tests. It receives the test name, and a callback function.
        //
        // If the callback function is async, Mocha will `await` it.
        it("Should set the right owner", async function () {
            // We use loadFixture to setup our environment, and then assert that
            // things went well
            const { hardhatStaking, owner } = await loadFixture(deployStakingFixture);

            // `expect` receives a value and wraps it in an assertion object. These
            // objects have a lot of utility methods to assert values.

            // This test expects the owner variable stored in the contract to be
            // equal to our Signer's owner.
            expect(await hardhatStaking.owner()).to.equal(owner.address);
        });
    });

    describe("Deposits", function () {
        it("Should allow users to stake ETH", async function () {
            const { hardhatStaking, owner, addr1, addr2 } = await loadFixture(
                deployStakingFixture
            );
            const amount = otherEthers.parseEther("1.0");
            await hardhatStaking.connect(addr1).deposit({ value: amount });
            const stakedBalance = await hardhatStaking.getStakedAmount(addr1.address);
            expect(stakedBalance).to.equal(amount);
        });

        it("Should not allow users to stake 0 ETH", async function () {
            const { hardhatStaking, owner, addr1, addr2 } = await loadFixture(
                deployStakingFixture
            );
            await expect(hardhatStaking.connect(addr1).deposit({ value: 0 })).to.be.revertedWith(
                "User must stake amount greater than 0");
        });
    });

    describe("Withdraw", function () {
        it("Should allow users to withdraw staked ETH", async function () {
            const { hardhatStaking, owner, addr1, addr2 } = await loadFixture(
                deployStakingFixture
            );
            // Stake 1 Eth.
            const amount = otherEthers.parseEther("1.0");
            await hardhatStaking.connect(addr1).deposit({ value: amount });
            // Withdraw that 1 Eth.
            const withdrawalAmount = otherEthers.parseEther("1.0");
            await hardhatStaking.connect(addr1).withdraw(withdrawalAmount);
            // Confirm user balance is back to 0.
            const stakedBalance = await hardhatStaking.getStakedAmount(addr1.address);
            expect(stakedBalance).to.equal(0);
        });

        it("Should not allow users to withdraw 0 ETH", async function () {
            const { hardhatStaking, owner, addr1, addr2 } = await loadFixture(
                deployStakingFixture
            );
            await expect(hardhatStaking.connect(addr1).withdraw(0)).to.be.revertedWith(
                "User amount to withdraw must be greater than 0"
            );
        });

        it("Should not allow users to withdraw more than their staked balance", async function () {
            const { hardhatStaking, owner, addr1, addr2 } = await loadFixture(
                deployStakingFixture
            );
            const withdrawalAmount = otherEthers.parseEther("3.0");
            await expect(hardhatStaking.connect(addr1).withdraw(withdrawalAmount)).to.be.revertedWith(
                "Insufficient staked balance"
            );
        });
    });

    describe("Get Staked Amount", function () {
        it("Should return the correct staked amount for a user", async function () {
            const { hardhatStaking, owner, addr1, addr2 } = await loadFixture(
                deployStakingFixture
            );
            const amount = otherEthers.parseEther("2.5");
            await hardhatStaking.connect(addr1).deposit({ value: amount });
            const stakedBalance = await hardhatStaking.getStakedAmount(addr1.address);
            expect(stakedBalance).to.equal(amount);
        });
    });
});
