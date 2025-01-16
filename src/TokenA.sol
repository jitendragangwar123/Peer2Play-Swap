// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TokenA - An ERC20 Token Implementation
 * @notice This contract represents TokenA, which follows the ERC20 standard.
 * @dev Uses OpenZeppelin's ERC20 implementation for security and efficiency.
 */
contract TokenA is ERC20 {
    /// @notice Constructor to initialize TokenA with a total supply of 1,000,000 tokens.
    constructor() ERC20("TokenA", "TKA") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
