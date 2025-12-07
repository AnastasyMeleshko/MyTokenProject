const { ethers } = require("hardhat");

async function main() {
    // 1️⃣ Получаем аккаунты (владельцев)
    const [owner1, owner2, owner3] = await ethers.getSigners();

    // 2️⃣ Адрес вашего развернутого мультисиг-контракта
    const walletAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // замените на свой

    // 3️⃣ ABI мультисиг-контракта (нужные функции + событие Confirmation)
    const walletAbi = [
        "function getOwners() view returns (address[])",
        "function getTransactionCount() view returns (uint)",
        "function submitTransaction(address to, uint value, bytes data) returns (uint)",
        "function confirmTransaction(uint txId)",
        "function executeTransaction(uint txId)",
        "function isConfirmed(uint txId) view returns (bool)",
        "event Confirmation(address indexed sender, uint indexed transactionId)"
    ];

    // 4️⃣ Подключаем контракт
    const walletContract = new ethers.Contract(walletAddress, walletAbi, ethers.provider);

    // 5️⃣ Получаем список владельцев
    const owners = await walletContract.getOwners();
    console.log("Owners:", owners);

    // 6️⃣ Получаем количество транзакций
    const txCount = await walletContract.getTransactionCount();
    console.log("Transaction count:", txCount.toString());

    if (txCount === 0n) {
        console.log("Нет транзакций для обработки.");
        return;
    }

    // 7️⃣ Выбираем последнюю транзакцию
    const txIdNew = Number(txCount - 1n); // преобразуем BigInt в Number для индекса
    console.log("New transaction ID:", txIdNew);

    // 8️⃣ Проверяем подтверждения
    const filter = walletContract.filters.Confirmation(null, txIdNew);
    const events = await walletContract.queryFilter(filter);

    console.log(`Confirmations for txId ${txIdNew}:`, events.map(e => e.args.sender));
    console.log(`Total confirmations: ${events.length}`);

    // 9️⃣ Исполняем транзакцию, если подтверждений достаточно
    const requiredConfirmations = 2; // сколько подтверждений нужно
    if (events.length >= requiredConfirmations) {
        console.log(`Executing transaction ${txIdNew}...`);
        const tx = await walletContract.connect(owner1).executeTransaction(txIdNew);
        await tx.wait();
        console.log(`Transaction ${txIdNew} executed successfully`);
    } else {
        console.log(`Transaction ${txIdNew} has not enough confirmations yet`);
    }
}

// Запуск скрипта
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
