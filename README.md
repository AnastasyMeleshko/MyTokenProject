# Step by step description for Module 6 and Module 7

# MODULE 6
# MyToken Hardhat Project

This project demonstrates how to build, deploy, and test a custom ERC20 token using [Hardhat](https://hardhat.org/) and [OpenZeppelin Contracts](https://openzeppelin.com/contracts/).

---

## 📂 Project Structure

```
MyTokenProject/
├── contracts/
│   └── MyToken.sol          # ERC20 token contract
├── scripts/
│   └── deploy.js            # Deployment script
├── test/
│   └── MyToken.js           # Unit tests
├── hardhat.config.js        # Hardhat configuration
├── package.json             # Project dependencies
├── package-lock.json        # NPM lock file
```

---

## ⚙️ Setup Instructions

1. **Install Node.js and npm**  
   Make sure you have Node.js (>= 18) and npm installed:
   ```bash
   node -v
   npm -v
   ```

2. **Install dependencies**  
   From the project root:
   ```bash
   npm install
   ```

3. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

---

## 🚀 Deployment

1. **Start a local Hardhat network**
   ```bash
   npx hardhat node
   ```

2. **Deploy the contract**  
   In a separate terminal:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

   Example output:
   ```
   Deploying contract with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   MyToken deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
   ```

---

## 🧪 Testing

1. **Run unit tests**
   ```bash
   npx hardhat test
   ```

2. **Example tests included**
    - Initial supply is correctly assigned to deployer
    - Token transfers between accounts
    - Minting restricted to owner

---

## 📖 Example Commands

- **Check balances in console**:
  ```bash
  npx hardhat console --network localhost
  ```
  Inside console:
  ```javascript
  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.attach("0xDEPLOYED_CONTRACT_ADDRESS");
  await token.totalSupply();
  ```

- **Clean cache and recompile**:
  ```bash
  npx hardhat clean
  npx hardhat compile
  ```

---

## 📦 Deliverables

- `contracts/MyToken.sol` — ERC20 token contract
- `scripts/deploy.js` — Deployment script
- `test/MyToken.js` — Unit tests for minting, transfers, and balances
- `README.md` — Documentation with setup and usage instructions

---

## ✅ Notes

- This project uses **Ethers v6**, so functions like `ethers.parseEther` and `contract.waitForDeployment()` are used instead of older v5 syntax.
- Run all commands from the project root directory.

----------------- MODULE 9 DESCRIPTION -----------------------------

# Module 9 – Soulbound ERC721 & ERC1155 Game NFTs

## Overview

In this module, we worked with **two types of NFTs**:

1. **Soulbound ERC721 NFT** – a non-transferable NFT representing a student's visit card.

   * Minted to a student address.
   * Cannot be transferred or approved (soulbound behavior).

2. **ERC1155 Game Collection NFT** – a multi-token NFT representing game characters.

   * Minted 10 different NFT IDs to the contract owner.
   * Transferred 2 NFTs to the student.

---

## Step-by-Step Workflow

### 1. Deploy Contracts

We deployed the **Soulbound ERC721** and **ERC1155 Game Collection** contracts to a local Hardhat network.

**Command:**

```bash
npx hardhat run scripts/deployModule9.js --network localhost
```

**Expected output:**

```
Soulbound ERC721 deployed to: <ERC721_ADDRESS>
ERC1155 Game Collection deployed to: <ERC1155_ADDRESS>
```

---

### 2. Mint NFTs

We minted:

* **Soulbound ERC721** NFT to the student.
* **10 ERC1155 NFTs** to the owner.
* **Transferred 2 ERC1155 NFTs** to the student.

**Command:**

```bash
npx hardhat run scripts/mintModule9.js --network localhost
```

**Expected output:**

```
Soulbound ERC721 minted to student: <STUDENT_ADDRESS>
ERC1155 GameCollection NFTs minted to owner
Transferred ERC1155 NFT ID 1 to student
Transferred ERC1155 NFT ID 2 to student
✅ Minting and transfers completed successfully!
```

---

### 3. Check Balances

We verified that:

* The student owns **1 Soulbound ERC721 NFT**.
* The student owns **2 ERC1155 NFTs** (IDs 1 and 2).
* The remaining ERC1155 NFT IDs are still held by the owner.

**Command:**

```bash
npx hardhat run scripts/checkBalances.js --network localhost
```

**Expected output:**

```
Student address: <STUDENT_ADDRESS>
Student has Soulbound NFT: true
Checking ERC1155 balances...
ERC1155 ID 1 balance for student: 1
ERC1155 ID 2 balance for student: 1
ERC1155 ID 3 balance for student: 0
ERC1155 ID 4 balance for student: 0
...
ERC1155 ID 10 balance for student: 0
✅ Balance check completed!
```

---

### 4. Manual Verification via Hardhat Console (Optional)

You can also manually inspect balances using Hardhat Console:

```bash
npx hardhat console --network localhost
```

**Example commands:**

```javascript
const { ethers, artifacts } = require("hardhat");

// Get contract artifacts
const sbArtifact = await artifacts.readArtifact("SoulboundVisitCardERC721");
const erc1155Artifact = await artifacts.readArtifact("GameCharacterCollectionERC1155");

// Connect to contracts
const soulbound = new ethers.Contract("<ERC721_ADDRESS>", sbArtifact.abi, ethers.provider);
const gameCollection = new ethers.Contract("<ERC1155_ADDRESS>", erc1155Artifact.abi, ethers.provider);

// Get signers
const [owner, student] = await ethers.getSigners();

// Check Soulbound ERC721 balance
const sbBalance = await soulbound.balanceOf(student.address);
console.log("Soulbound NFT balance:", sbBalance.toString());

// Check ERC1155 balances
for (let id = 1; id <= 10; id++) {
    const bal = await gameCollection.balanceOf(student.address, id);
    console.log(`ERC1155 ID ${id} balance for student:`, bal.toString());
}
```

**Expected result:**

```
Soulbound NFT balance: 1
ERC1155 ID 1 balance for student: 1
ERC1155 ID 2 balance for student: 1
ERC1155 ID 3 balance for student: 0
...
ERC1155 ID 10 balance for student: 0
```

---

## Summary

✅ **Module 9 completed successfully**:

* Deployed Soulbound ERC721 and ERC1155 contracts.
* Minted Soulbound NFT to a student.
* Minted 10 ERC1155 NFTs to the owner and transferred 2 to the student.
* Verified balances programmatically and optionally via console.

# Module 7 – Upgradable ERC20 Contract (Proxy Pattern)

## Overview
This assignment demonstrates how to make a smart contract upgradable using the **Proxy Pattern**.  
We start from the ERC20 token created in Module 6, deploy it through a proxy, then upgrade the proxy to point to a new implementation (V2) while preserving state (balances).

## Contracts
- **MyTokenV1Upgradeable.sol**  
  Initial ERC20 implementation with `initialize()` instead of constructor. Includes minting restricted to the owner.

- **Proxy (Transparent Proxy via OpenZeppelin Upgrades)**  
  Deployed automatically using Hardhat + OpenZeppelin upgrades plugin.

- **MyTokenV2Upgradeable.sol**  
  Extended version of V1 with an additional function:
  ```solidity
  function version() public pure returns (string memory) {
      return "V2";
  }

#Project Setup
Clone or open the project folder MyTokenProject.
Install dependencies:
npm install
npm install --save-dev @openzeppelin/hardhat-upgrades
npm install @openzeppelin/contracts-upgradeable


Ensure hardhat.config.js includes:
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");


#Deployment and Testing Steps
1. Compile contracts
   npx hardhat compile

2. Start local Hardhat network
   npx hardhat node

3. Deploy Proxy with V1 implementation
   npx hardhat run scripts/deployProxy.js --network localhost

#Expected output:
Deployer address
Proxy address
Initial balance of deployer

4. Interact with V1 through Proxy
Set proxy address in environment variable:

Git Bash:
export PROXY=0xYourProxyAddress

PowerShell:
$env:PROXY="0xYourProxyAddress"

Run interaction script:
npx hardhat run scripts/interactV1.js --network localhost

Expected output:
Initial balances
Mint transaction hash
Transfer transaction hash
Updated balances

5. Upgrade Proxy to V2
npx hardhat run scripts/upgradeProxy.js --network localhost

Expected output:
Confirmation of upgrade
version(): V2

6. Validate after upgrade
npx hardhat run scripts/validateAfterUpgrade.js --network localhost

Expected output:
version(): V2
Balances unchanged from step 4

7.Optional: Console checks
npx hardhat console --network localhost

Inside console:
const MyTokenV2 = await ethers.getContractFactory("MyTokenV2Upgradeable");
const token = MyTokenV2.attach(process.env.PROXY);
(await token.name()).toString();   // "MyToken"
(await token.symbol()).toString(); // "MTK"
await token.version();             // "V2"

Deliverables

Contracts:
contracts/MyTokenV1Upgradeable.sol
contracts/MyTokenV2Upgradeable.sol

Scripts:
scripts/deployProxy.js
scripts/interactV1.js
scripts/upgradeProxy.js
scripts/validateAfterUpgrade.js

Evidence:
Logs/screenshots of deployment, interaction, upgrade, and validation
(Optional) Explorer links if deployed on Sepolia or another testnet
Learning Outcomes
Understand the Proxy Pattern for smart contract upgradeability
Deploy and interact with contracts via proxy
Perform upgrades without losing state
Verify new functionality (version()) after upgrade
