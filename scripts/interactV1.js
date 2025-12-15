const { ethers } = require("hardhat");

async function main() {
    const proxyAddress = process.env.PROXY;
    if (!proxyAddress) throw new Error("Set PROXY env var to proxy address");

    const [owner, user1] = await ethers.getSigners();

    const MyTokenV1 = await ethers.getContractFactory("MyTokenV1Upgradeable");
    const token = MyTokenV1.attach(proxyAddress);

    console.log("Initial balances:");
    console.log("Owner:", (await token.balanceOf(owner.address)).toString());
    console.log("User1:", (await token.balanceOf(user1.address)).toString());

    // Mint 100 MTK to user1
    const mintTx = await token.connect(owner).mint(user1.address, ethers.parseUnits("100", 18));
    await mintTx.wait();
    console.log("Minted 100 MTK to User1:", mintTx.hash);

    // User1 transfers 25 MTK back to owner
    const transferTx = await token.connect(user1).transfer(owner.address, ethers.parseUnits("25", 18));
    await transferTx.wait();
    console.log("User1 transferred 25 MTK to Owner:", transferTx.hash);

    console.log("Balances after:");
    console.log("Owner:", (await token.balanceOf(owner.address)).toString());
    console.log("User1:", (await token.balanceOf(user1.address)).toString());
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
