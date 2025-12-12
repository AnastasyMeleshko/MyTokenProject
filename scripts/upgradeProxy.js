const { ethers, upgrades } = require("hardhat");

async function main() {
    const proxyAddress = process.env.PROXY;
    if (!proxyAddress) throw new Error("Set PROXY env var to proxy address");

    const MyTokenV2 = await ethers.getContractFactory("MyTokenV2Upgradeable");
    const upgraded = await upgrades.upgradeProxy(proxyAddress, MyTokenV2);

    const addr = await upgraded.getAddress();
    console.log("Upgraded proxy at:", addr);

    console.log("version():", await upgraded.version());
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
