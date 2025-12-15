const { ethers, artifacts } = require("hardhat");

async function main() {
    const [owner, student] = await ethers.getSigners();

    const sbAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const erc1155Address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    // Получаем полный ABI
    const sbArtifact = await artifacts.readArtifact("SoulboundVisitCardERC721");
    const erc1155Artifact = await artifacts.readArtifact("GameCharacterCollectionERC1155");

    const soulbound = new ethers.Contract(sbAddress, sbArtifact.abi, owner);
    const gameCollection = new ethers.Contract(erc1155Address, erc1155Artifact.abi, owner);

    console.log("Student address:", student.address);

    // Soulbound ERC721: проверяем наличие токена
    const hasMinted = await soulbound.hasMinted(student.address);
    console.log("Student has Soulbound NFT:", hasMinted);

    // ERC1155: проверяем балансы по каждому ID
    console.log("Checking ERC1155 balances...");
    const ids = [1,2,3,4,5,6,7,8,9,10];

    for (const id of ids) {
        const balance = await gameCollection.balanceOf(student.address, id);
        console.log(`ERC1155 ID ${id} balance for student:`, balance.toString());
    }

    console.log("✅ Balance check completed!");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
