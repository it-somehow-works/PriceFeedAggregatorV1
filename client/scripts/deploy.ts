async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const token = await ethers.deployContract("Token");

    console.log("Token address:", await token.getAddress());


    const staking = await ethers.deployContract("Staking");

    console.log("Staking address:", await staking.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });