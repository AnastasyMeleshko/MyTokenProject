
const { ethers } = require("hardhat");

async function main() {
    // Connect to accounts
    const [owner1, owner2, owner3, recipient] = await ethers.getSigners();

    // Replace with your deployed contract address
    const walletAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Get contract instance
    const wallet = await ethers.getContractAt("MultiSigWallet", walletAddress);

    // Get owners
    const owners = [];
    const ownersCount = 3;
    for (let i = 0; i < ownersCount; i++) {
        owners.push(await wallet.owners(i));
    }
    console.log("Owners:", owners);

    // Get confirmation threshold
    const threshold = await wallet.required();
    console.log("Confirmation threshold:", threshold.toString());

    // Submit a transaction: send 0.01 ETH to recipient
    const txValue = ethers.parseEther("0.01");
    const txData = "0x"; // empty data for ETH transfer
    const txTo = recipient.address;

    let tx = await wallet.connect(owner1).submitTransaction(txTo, txValue, txData);
    await tx.wait();
    console.log("Transaction submitted");

    // Confirm transaction by owner1 and owner2
    await wallet.connect(owner1).confirmTransaction(0);
    await wallet.connect(owner2).confirmTransaction(0);
    console.log("Transaction confirmed by two owners");

    // Execute the transaction
    await wallet.connect(owner1).executeTransaction(0);
    console.log("Transaction executed");

    // Check recipient balance
    const recipientBalance = await ethers.provider.getBalance(recipient.address);
    console.log("Recipient balance:", ethers.formatEther(recipientBalance), "ETH");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
