// scripts/multisigRun.js
const { ethers } = require("hardhat");

async function main() {
    // 1️⃣ Get Signers
    const [owner1, owner2, owner3] = await ethers.getSigners();

    // 2️⃣ Multisig contract ABI
    const walletAbi = [
        "function getOwners() view returns (address[])",
        "function getTransactionCount() view returns (uint)",
        "function submitTransaction(address to, uint value, bytes data) returns (uint)",
        "function confirmTransaction(uint txId)",
        "function executeTransaction(uint txId)",
        "function isConfirmed(uint txId) view returns (bool)",
        "event Submission(address indexed sender, uint indexed transactionId)",
        "event Confirmation(address indexed sender, uint indexed transactionId)",
        "event Execution(uint indexed transactionId)"
    ];

    // 3️⃣ Multisig contract address (replace with your deployed address)
    const walletAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // 4️⃣ Connect to the multisig contract (read-only initially)
    const walletContract = new ethers.Contract(walletAddress, walletAbi, ethers.provider);

    // 5️⃣ Print owners
    const owners = await walletContract.getOwners();
    console.log("Owners:", owners);

    // 6️⃣ Transaction details
    const txTo = "0x90f79bf6eb2c4f870365e785982e1f101e93b906"; // recipient address
    const txValue = ethers.parseEther("0.01"); // amount in ETH
    const txData = "0x"; // empty data for ETH transfer

    // 7️⃣ Submit transaction by owner1
    const submitTx = await walletContract.connect(owner1).submitTransaction(txTo, txValue, txData);
    const receipt = await submitTx.wait();
    console.log("Transaction submitted by owner1");

    // 8️⃣ Get transaction ID from Submission event
    let txId;
    const submissionEvent = receipt.logs
        .map(log => {
            try {
                return walletContract.interface.parseLog(log);
            } catch {
                return null;
            }
        })
        .find(parsed => parsed && parsed.name === "Submission");

    if (submissionEvent) {
        txId = submissionEvent.args.transactionId;
    } else {
        const txCount = await walletContract.getTransactionCount();
        txId = txCount - 1n;
    }
    console.log("Transaction ID:", txId.toString());

    // 9️⃣ Confirm transaction by owner1
    await walletContract.connect(owner1).confirmTransaction(txId);
    console.log("Transaction confirmed by owner1");

    // 10️⃣ Confirm transaction by owner2
    await walletContract.connect(owner2).confirmTransaction(txId);
    console.log("Transaction confirmed by owner2");

    // 11️⃣ Execute transaction (connect signer)
    const executedTransaction = await walletContract.connect(owner1).executeTransaction(txId);
    await executedTransaction.wait();
    console.log("Transaction executed successfully");
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
