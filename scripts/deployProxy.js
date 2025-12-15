const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const MyTokenV1 = await ethers.getContractFactory("MyTokenV1Upgradeable");
    const initialSupply = ethers.parseUnits("1000000", 18);

    const proxy = await upgrades.deployProxy(MyTokenV1, [initialSupply], {
        kind: "transparent",
    });

    // ethers v6: address via getAddress()
    const proxyAddress = await proxy.getAddress();
    console.log("Proxy deployed to:", proxyAddress);

    const balance = await proxy.balanceOf(deployer.address);
    console.log("Balance of deployer:", balance.toString());
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
