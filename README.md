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
```

