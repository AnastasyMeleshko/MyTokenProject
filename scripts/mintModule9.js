const { ethers, artifacts } = require("hardhat");

async function main() {
    const [owner, student] = await ethers.getSigners();

    // Контракты
    const sbAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const erc1155Address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    // Получаем полный ABI
    const sbArtifact = await artifacts.readArtifact("SoulboundVisitCardERC721");
    const erc1155Artifact = await artifacts.readArtifact("GameCharacterCollectionERC1155");

    const soulbound = new ethers.Contract(sbAddress, sbArtifact.abi, owner);
    const gameCollection = new ethers.Contract(erc1155Address, erc1155Artifact.abi, owner);

    // ✅ Mint Soulbound NFT
    const mintTx = await soulbound.mint(student.address);
    await mintTx.wait();
    console.log(`Soulbound ERC721 minted to student: ${student.address}`);

    // ✅ Mint 10 ERC1155 NFTs using mintBatch
    const ids = [1,2,3,4,5,6,7,8,9,10];
    const amounts = Array(ids.length).fill(1); // по 1 NFT каждого типа

    const mintBatchTx = await gameCollection.mintBatch(owner.address, ids, amounts);
    await mintBatchTx.wait();
    console.log("ERC1155 GameCollection NFTs minted to owner");

    // Transfer 2 NFTs to student
    await gameCollection.safeTransferFrom(owner.address, student.address, 1, 1, "0x");
    console.log("Transferred ERC1155 NFT ID 1 to student");

    await gameCollection.safeTransferFrom(owner.address, student.address, 2, 1, "0x");
    console.log("Transferred ERC1155 NFT ID 2 to student");

    console.log("✅ Minting and transfers completed successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
