// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyTokenV1Upgradeable.sol";

contract MyTokenV2Upgradeable is MyTokenV1Upgradeable {
    function version() public pure returns (string memory) {
        return "V2";
    }
}
