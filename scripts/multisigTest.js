async function main() {
    // 1. Get the contract factory
    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");

    // 2. Deploy the multisig wallet (if not already deployed)
    const owners = [
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    ];
    const requiredConfirmations = 2;
    const wallet = await MultiSigWallet.deploy(owners, requiredConfirmations);
    await wallet.deployed();
    console.log("MultiSigWallet deployed to:", wallet.target);

    // 3. Check wallet balance
    let walletBalance = await ethers.provider.getBalance(wallet.target);
    console.log("Wallet balance:", ethers.formatEther(walletBalance), "ETH");

    // 4. Get the first three accounts for testing
    const [owner1, owner2, recipient] = await ethers.getSigners();

    // 5. Deposit 1 ETH into the multisig wallet for testing
    const depositTx = await owner1.sendTransaction({
        to: wallet.target,
        value: ethers.parseEther("1.0")
    });
    await depositTx.wait();
    walletBalance = await ethers.provider.getBalance(wallet.target);
    console.log("Wallet balance after deposit:", ethers.formatEther(walletBalance), "ETH");

    // 6. Create a transaction to send 0.01 ETH to the recipient
    const txValue = ethers.parseEther("0.01");
    const txData = "0x"; // empty data
    const txTo = recipient.address;
    const submitTx = await wallet.connect(owner1).submitTransaction(txTo, txValue, txData);
    await submitTx.wait();

    // 7. Get the ID of the last transaction
    const txCount = await wallet.getTransactionCount(); // BigInt
    const txId = Number(txCount) - 1;
    console.log("Transaction ID:", txId);

    // 8. Confirm the transaction by two owners
    await wallet.connect(owner1).confirmTransaction(txId);
    await wallet.connect(owner2).confirmTransaction(txId);
    console.log("Transaction confirmed by owner1 and owner2");

    // 9. Execute the transaction after confirmations
    await wallet.connect(owner1).executeTransaction(txId);
    console.log("Transaction executed");

    // 10. Check recipient balance
    const recipientBalance = await ethers.provider.getBalance(recipient.address);
    console.log("Recipient balance:", ethers.formatEther(recipientBalance), "ETH");

    // 11. Check multisig wallet balance after execution
    walletBalance = await ethers.provider.getBalance(wallet.target);
    console.log("Wallet balance after execution:", ethers.formatEther(walletBalance), "ETH");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
