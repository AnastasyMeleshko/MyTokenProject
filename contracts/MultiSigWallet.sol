// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MultiSigWallet {
    address[] public owners;
    uint public required;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint confirmations;
    }

    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public isConfirmed;

    constructor(address[] memory _owners, uint _required) {
        owners = _owners;
        required = _required;
    }

    modifier onlyOwner() {
        bool isOwner = false;
        for (uint i = 0; i < owners.length; i++) {
            if (msg.sender == owners[i]) {
                isOwner = true;
            }
        }
        require(isOwner, "Not owner");
        _;
    }

    function submitTransaction(address _to, uint _value, bytes memory _data) public onlyOwner returns (uint txId) {
        txId = transactions.length;
        transactions.push(Transaction(_to, _value, _data, false, 0));
    }

    function confirmTransaction(uint _txId) public onlyOwner {
        require(!isConfirmed[_txId][msg.sender], "Transaction already confirmed");
        Transaction storage txn = transactions[_txId];
        txn.confirmations += 1;
        isConfirmed[_txId][msg.sender] = true;
    }

    function executeTransaction(uint _txId) public onlyOwner {
        Transaction storage txn = transactions[_txId];
        require(txn.confirmations >= required, "Not enough confirmations");
        require(!txn.executed, "Transaction already executed");
        txn.executed = true;
        (bool success,) = txn.to.call{value: txn.value}(txn.data);
        require(success, "Transaction failed");
    }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    receive() external payable {}
}
