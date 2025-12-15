
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with:", deployer.address);

    // Deploy Soulbound ERC721
    const Soulbound = await ethers.getContractFactory("SoulboundVisitCardERC721");
    const soulbound = await Soulbound.deploy();
    await soulbound.waitForDeployment();

    console.log("Soulbound ERC721 deployed to:", soulbound.target);

    // Deploy ERC1155 Game Collection
    const GameCollection = await ethers.getContractFactory("GameCharacterCollectionERC1155");
    const gameCollection = await GameCollection.deploy();
    await gameCollection.waitForDeployment();

    console.log("ERC1155 Game Collection deployed to:", gameCollection.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
