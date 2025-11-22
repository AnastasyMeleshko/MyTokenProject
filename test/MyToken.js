const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
    it("Should deploy with correct initial supply", async function () {
        const [deployer, user] = await ethers.getSigners();
        const MyToken = await ethers.getContractFactory("MyToken");
        const myToken = await MyToken.deploy(ethers.parseEther("1000000"));

        // Проверка баланса деплойера
        expect(await myToken.balanceOf(deployer.address))
            .to.equal(ethers.parseEther("1000000"));

        // Тест перевода
        await myToken.transfer(user.address, ethers.parseEther("100"));
        expect(await myToken.balanceOf(user.address))
            .to.equal(ethers.parseEther("100"));
    });

    it("Owner can mint new tokens", async function () {
        const [deployer, user] = await ethers.getSigners();
        const MyToken = await ethers.getContractFactory("MyToken");
        const myToken = await MyToken.deploy(ethers.parseEther("1000000"));

        await myToken.mint(user.address, ethers.parseEther("500"));
        expect(await myToken.balanceOf(user.address))
            .to.equal(ethers.parseEther("500"));
    });
});
