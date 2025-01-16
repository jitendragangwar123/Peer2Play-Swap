// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {LiquidityPool} from "../../src/LiquidityPool.sol";
import {TokenA} from "../../src/TokenA.sol";
import {TokenB} from "../../src/TokenB.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityPoolTest is Test {
    LiquidityPool public liquidityPool;
    TokenA public tokenA;
    TokenB public tokenB;

    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        tokenA = new TokenA("TokenA", "TKA");
        tokenB = new TokenB("TokenB", "TKB");

        liquidityPool = new LiquidityPool(address(tokenA), address(tokenB));
        tokenA.mint(user1, 1000 ether);
        tokenB.mint(user1, 1000 ether);
        tokenA.mint(user2, 1000 ether);
        tokenB.mint(user2, 1000 ether);

        vm.startPrank(user1);
        tokenA.approve(address(liquidityPool), type(uint256).max);
        tokenB.approve(address(liquidityPool), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(user2);
        tokenA.approve(address(liquidityPool), type(uint256).max);
        tokenB.approve(address(liquidityPool), type(uint256).max);
        vm.stopPrank();
    }

    function testAddLiquidity() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(100 ether, 100 ether);

        assertEq(liquidityPool.balanceOf(user1), 100 ether, "Incorrect liquidity token balance");
        assertEq(liquidityPool.reserveA(), 100 ether, "Incorrect reserveA");
        assertEq(liquidityPool.reserveB(), 100 ether, "Incorrect reserveB");

        vm.stopPrank();
    }

    function testRemoveLiquidity() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(100 ether, 100 ether);

        uint256 initialBalanceA = tokenA.balanceOf(user1);
        uint256 initialBalanceB = tokenB.balanceOf(user1);

        liquidityPool.removeLiquidity(100 ether);

        assertEq(
            tokenA.balanceOf(user1), initialBalanceA + 100 ether, "Incorrect TokenA balance after removing liquidity"
        );
        assertEq(
            tokenB.balanceOf(user1), initialBalanceB + 100 ether, "Incorrect TokenB balance after removing liquidity"
        );
        assertEq(liquidityPool.totalSupply(), 0, "Liquidity tokens should be burned");

        vm.stopPrank();
    }

    function testGetAmountOut() public view {
        uint256 amountOut = liquidityPool.getAmountOut(100 ether, 500 ether, 500 ether);
        assertGt(amountOut, 0, "AmountOut should be greater than zero");
    }

    function testFailAddLiquidityWithZeroAmounts() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(0, 0);
        vm.stopPrank();
    }

    function testFailRemoveLiquidityWithInsufficientBalance() public {
        vm.startPrank(user1);
        liquidityPool.removeLiquidity(1 ether);
        vm.stopPrank();
    }

    function testFailSwapWithInvalidToken() public {
        vm.startPrank(user1);
        liquidityPool.swap(address(0), 100 ether);
        vm.stopPrank();
    }
    

    
    
}
