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
