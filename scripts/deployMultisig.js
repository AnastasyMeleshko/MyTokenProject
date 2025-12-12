const { ethers } = require("hardhat");

async function main() {
    // 1. Get test accounts
    const [owner1, owner2, owner3, recipient] = await ethers.getSigners();

    // 2. Get the contract factory
    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");

    // 3. Deploy the MultiSigWallet contract with 3 owners and 2 required confirmations
    const wallet = await MultiSigWallet.deploy(
        [owner1.address, owner2.address, owner3.address], // owners
        2 // required confirmations
    );

    // No need to call wallet.deployed() in Ethers v6
    console.log("MultiSigWallet deployed to:", wallet.target);

    // 4. Fund the wallet with 1 ETH
    const depositTx = await owner1.sendTransaction({
        to: wallet.target,
        value: ethers.parseEther("1.0")
    });
    await depositTx.wait();
    console.log("Wallet funded with 1 ETH");

    // 5. Create a transaction to send 0.01 ETH to recipient
    const txValue = ethers.parseEther("0.01");
    const txData = "0x"; // empty data
    let tx = await wallet.connect(owner1).submitTransaction(recipient.address, txValue, txData);
    await tx.wait();

    // 6. Get the ID of the transaction (last one)
    let txCount = await wallet.getTransactionCount(); // BigInt
    let txId = Number(txCount) - 1; // convert to Number
    console.log("Transaction ID:", txId);

    // 7. Confirm the transaction by two owners
    await wallet.connect(owner1).confirmTransaction(txId);
    await wallet.connect(owner2).confirmTransaction(txId);
    console.log("Transaction confirmed by owner1 and owner2");

    // 8. Execute the transaction
    await wallet.connect(owner1).executeTransaction(txId);
    console.log("Transaction executed");

    // 9. Check recipient balance
    const balance = await ethers.provider.getBalance(recipient.address);
    console.log("Recipient balance:", ethers.formatEther(balance), "ETH");
}

// Run the script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
