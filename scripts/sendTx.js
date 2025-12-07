const { ethers } = require("hardhat");

async function main() {
    // 1️⃣ Получаем владельцев (Signers)
    const [owner1, owner2, owner3] = await ethers.getSigners();

    // 2️⃣ ABI мультисиг-контракта
    const walletAbi = [
        "function getOwners() view returns (address[])",
        "function getTransactionCount() view returns (uint)",
        "function submitTransaction(address to, uint value, bytes data) returns (uint)",
        "function confirmTransaction(uint txId)",
        "function executeTransaction(uint txId)",
        "function isConfirmed(uint txId) view returns (bool)",
        "event Confirmation(address indexed sender, uint indexed transactionId)"
    ];

    // 3️⃣ Адрес мультисиг-контракта
    const walletAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // 4️⃣ Создаём объект контракта **с owner1 как Signer**, чтобы можно было отправлять tx
    const walletContract = new ethers.Contract(walletAddress, walletAbi, owner1);

    // 5️⃣ Делаем новую транзакцию
    const txTo = "0x90f79bf6eb2c4f870365e785982e1f101e93b906"; // получатель
    const txValue = ethers.parseEther("0.01"); // сумма в ETH
    const txData = "0x"; // данные, если нужны

    const tx = await walletContract.submitTransaction(txTo, txValue, txData);
    await tx.wait();

    console.log("Transaction submitted by owner1");
}

main().catch(console.error);
