// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TokenB - An ERC20 Token Implementation
 * @author Jitendra Kumar
 * @notice A customizable ERC20 token with mint functionality.
 * @dev Allows for token name and symbol initialization during deployment.
 */
contract TokenB is ERC20 {
    /**
     * @notice Constructor to initialize the token with a name and symbol.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    /**
     * @notice Mints new tokens to the specified address.
     * @dev This function allows the caller to create new tokens.
     * @param to The address that will receive the minted tokens.
     * @param amount The number of tokens to mint (adjusted by decimals).
     */
    function mint(address to, uint256 amount) external {
        require(to != address(0), "TokenB: mint to the zero address");
        require(amount > 0, "TokenB: mint amount must be greater than zero");
        _mint(to, amount);
    }
}
