// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SoulboundVisitCardERC721
 * @dev Soulbound ERC-721 NFT representing a student's visit card.
 * Transfers and approvals are disabled after minting.
 */
contract SoulboundVisitCardERC721 is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    // Ensure one visit card per student
    mapping(address => bool) public hasMinted;

    constructor()
    ERC721("Student Visit Card", "SVC")
    Ownable(msg.sender)
    {}

    /**
     * @dev Mint a soulbound visit card to a student.
     * Only contract owner (admin) can mint.
     */
    function mint(address student) external onlyOwner {
        require(!hasMinted[student], "Student already has a visit card");

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        hasMinted[student] = true;
        _safeMint(student, tokenId);
    }

    /**
     * @dev Override update to block transfers (Soulbound behavior)
     * Allow only minting (from == address(0))
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0), "Soulbound: transfers are not allowed");
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Disable approvals
     */
    function approve(address, uint256) public pure override {
        revert("Soulbound: approvals are disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound: approvals are disabled");
    }

    /**
     * @dev Token metadata URI (IPFS placeholder)
     */
    function tokenURI(uint256) public pure override returns (string memory) {
        return "ipfs://QmYourSoulboundMetadataHash/metadata.json";
    }
}
