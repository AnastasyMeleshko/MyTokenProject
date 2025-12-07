const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiSigWallet", function () {
    let wallet, owner1, owner2, owner3, users;

    beforeEach(async () => {
        [owner1, owner2, owner3, ...users] = await ethers.getSigners();

        const MultiSig = await ethers.getContractFactory("MultiSigWallet");
        wallet = await MultiSig.deploy(
            [owner1.address, owner2.address, owner3.address],
            2
        );

        await wallet.waitForDeployment();
    });

    it("should deploy with correct owners and required confirmations", async () => {
        expect(await wallet.required()).to.equal(2);
        expect(await wallet.isOwner(owner1.address)).to.equal(true);
    });

    it("should allow owners to submit a transaction", async () => {
        await wallet.connect(owner1).submitTransaction(owner2.address, 0, "0x");

        const tx = await wallet.transactions(0);
        expect(tx.to).to.equal(owner2.address);
    });

    it("should allow confirmations", async () => {
        await wallet.connect(owner1).submitTransaction(owner2.address, 0, "0x");
        await wallet.connect(owner1).confirmTransaction(0);
        await wallet.connect(owner2).confirmTransaction(0);

        const tx = await wallet.transactions(0);
        expect(tx.numConfirmations).to.equal(2);
    });

    it("should execute a confirmed transaction", async () => {
        // Deposit ether
        await owner1.sendTransaction({
            to: await wallet.getAddress(),
            value: ethers.parseEther("1"),
        });

        // Submit tx
        await wallet.connect(owner1).submitTransaction(
            owner2.address,
            ethers.parseEther("1"),
            "0x"
        );

        // Confirm
        await wallet.connect(owner1).confirmTransaction(0);
        await wallet.connect(owner2).confirmTransaction(0);

        // Execute
        const before = await ethers.provider.getBalance(owner2.address);
        await wallet.connect(owner1).executeTransaction(0);
        const after = await ethers.provider.getBalance(owner2.address);

        expect(after).to.be.gt(before);
    });

    it("should allow revoking confirmation", async () => {
        await wallet.connect(owner1).submitTransaction(owner2.address, 0, "0x");
        await wallet.connect(owner1).confirmTransaction(0);

        await wallet.connect(owner1).revokeConfirmation(0);

        const tx = await wallet.transactions(0);
        expect(tx.numConfirmations).to.equal(0);
    });
});
