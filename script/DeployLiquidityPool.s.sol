// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {LiquidityPool} from "../src/LiquidityPool.sol";
import {TokenA} from "../src/TokenA.sol";
import {TokenB} from "../src/TokenB.sol";

contract DeployLiquidityPool is Script {
    function run() external returns (TokenA, TokenB, LiquidityPool) {
        string memory tokenAName = "TokenA";
        string memory tokenASymbol = "TKA";

        string memory tokenBName = "TokenB";
        string memory tokenBSymbol = "TKB";

        uint256 mintAmountA = 1_000_000 * 10 ** 18;
        uint256 mintAmountB = 1_00_000 * 10 ** 18;
        vm.startBroadcast();
        TokenA tokenA = new TokenA(tokenAName, tokenASymbol);
        TokenB tokenB = new TokenB(tokenBName, tokenBSymbol);
        LiquidityPool liquidityPool = new LiquidityPool(address(tokenA), address(tokenB));

        tokenA.mint(msg.sender, mintAmountA);
        tokenB.mint(msg.sender, mintAmountB);

        tokenA.approve(address(liquidityPool), mintAmountA);
        tokenB.approve(address(liquidityPool), mintAmountB);
        vm.stopBroadcast();
        return (tokenA, tokenB, liquidityPool);
    }
}
