// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GameCharacterCollectionERC1155
 * @dev ERC-1155 contract managing multiple game character NFTs.
 */
contract GameCharacterCollectionERC1155 is ERC1155, Ownable {

    uint256 public constant KITTY   = 1;
    uint256 public constant BUNNY   = 2;
    uint256 public constant DOGGY   = 3;
    uint256 public constant DRAGON  = 4;
    uint256 public constant WIZARD  = 5;
    uint256 public constant KNIGHT  = 6;
    uint256 public constant ELF     = 7;
    uint256 public constant ORC     = 8;
    uint256 public constant ROBOT   = 9;
    uint256 public constant ALIEN   = 10;

    constructor()
    ERC1155("ipfs://QmYourERC1155MetadataHash/{id}.json")
    Ownable(msg.sender)
    {}

    /**
     * @dev Batch mint game character NFTs.
     * Only owner can mint.
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external onlyOwner {
        _mintBatch(to, ids, amounts, "");
    }
}
