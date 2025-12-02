const { ethers } = require("hardhat");

async function main() {
    const proxyAddress = process.env.PROXY;
    if (!proxyAddress) throw new Error("Set PROXY env var to proxy address");

    const [owner, user1] = await ethers.getSigners();

    const MyTokenV2 = await ethers.getContractFactory("MyTokenV2Upgradeable");
    const token = MyTokenV2.attach(proxyAddress);

    console.log("version():", await token.version());
    console.log("Balances (should be unchanged):");
    console.log("Owner:", (await token.balanceOf(owner.address)).toString());
    console.log("User1:", (await token.balanceOf(user1.address)).toString());
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
