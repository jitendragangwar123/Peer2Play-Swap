// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {LiquidityPool} from "../../src/LiquidityPool.sol";
import {TokenA} from "../../src/TokenA.sol";
import {TokenB} from "../../src/TokenB.sol";

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

    function test_RevertWhen_AddLiquidityWithZeroAmounts() public {
        vm.startPrank(user1);
        vm.expectRevert("Amounts must be greater than zero");
        liquidityPool.addLiquidity(0, 0);
        vm.stopPrank();
    }

    function test_RevertWhen_RemoveLiquidityWithInsufficientBalance() public {
        vm.startPrank(user1);
        vm.expectRevert("Insufficient liquidity shares");
        liquidityPool.removeLiquidity(1 ether);
        vm.stopPrank();
    }

    function test_RevertWhen_SwapWithInvalidToken() public {
        vm.startPrank(user1);
        vm.expectRevert("Invalid token address");
        liquidityPool.swap(address(0), 100 ether);
        vm.stopPrank();
    }

    function testSwapTokenAForTokenB() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(500 ether, 500 ether);

        uint256 initialBalanceB = tokenB.balanceOf(user1);
        uint256 amountIn = 100 ether;
        liquidityPool.swap(address(tokenA), amountIn);
        uint256 finalBalanceB = tokenB.balanceOf(user1);
        assertGt(finalBalanceB, initialBalanceB, "TokenB balance should increase after swapping");
        vm.stopPrank();
    }

    function testSwapTokenBForTokenA() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(500 ether, 500 ether);

        uint256 initialBalanceA = tokenA.balanceOf(user1);
        uint256 amountIn = 100 ether;
        liquidityPool.swap(address(tokenB), amountIn);
        uint256 finalBalanceA = tokenA.balanceOf(user1);
        assertGt(finalBalanceA, initialBalanceA, "TokenA balance should increase after swapping");
        vm.stopPrank();
    }

    function test_RevertWhen_SwapWithZeroAmount() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(500 ether, 500 ether);
        vm.expectRevert("Amount must be greater than zero");
        liquidityPool.swap(address(tokenA), 0);
        vm.stopPrank();
    }

    function test_RevertWhen_SwapWithInsufficientReserve() public {
        vm.startPrank(user1);
        uint256 amountIn = 1000 ether;
        vm.expectRevert("Reserves must be greater than zero");
        liquidityPool.swap(address(tokenA), amountIn);
        vm.stopPrank();
    }

    function test_RevertWhen_AddLiquidityWithoutApproval() public {
        vm.startPrank(user1);
        tokenA.approve(address(liquidityPool), 0);

        vm.expectRevert("Allowance for tokenA is not enough");
        liquidityPool.addLiquidity(100 ether, 100 ether);
        vm.stopPrank();
    }

    function testRemoveLiquidityAdjustsShares() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(500 ether, 500 ether);
        uint256 initialShares = liquidityPool.liquidityShares(user1);
        liquidityPool.removeLiquidity(100 ether);
        uint256 finalShares = liquidityPool.liquidityShares(user1);
        assertLt(finalShares, initialShares, "Liquidity shares should decrease after removal");
        vm.stopPrank();
    }

    function testPartialRemoveLiquidity() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(500 ether, 500 ether);
        uint256 initialShares = liquidityPool.liquidityShares(user1);
        liquidityPool.removeLiquidity(250 ether);
        uint256 finalShares = liquidityPool.liquidityShares(user1);
        assertEq(finalShares, initialShares / 2, "Partial liquidity removal failed");
        assertEq(liquidityPool.reserveA(), 250 ether, "ReserveA should adjust after partial removal");
        assertEq(liquidityPool.reserveB(), 250 ether, "ReserveB should adjust after partial removal");
        vm.stopPrank();
    }

    function testAddLiquidityWithImbalance() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(100 ether, 50 ether);
        assertEq(liquidityPool.reserveA(), 100 ether, "ReserveA should reflect added amount");
        assertEq(liquidityPool.reserveB(), 50 ether, "ReserveB should reflect added amount");
        vm.stopPrank();
    }

    function test_RevertWhen_SwapWithoutLiquidity() public {
        vm.startPrank(user1);
        vm.expectRevert("Reserves must be greater than zero");
        liquidityPool.swap(address(tokenA), 100 ether);
        vm.stopPrank();
    }

    function testAddLiquidityFromMultipleUsers() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(100 ether, 100 ether);
        vm.stopPrank();
        vm.startPrank(user2);
        liquidityPool.addLiquidity(200 ether, 200 ether);
        vm.stopPrank();
        assertEq(liquidityPool.totalSupply(), 300 ether, "Total supply should reflect combined liquidity");
        assertEq(liquidityPool.reserveA(), 300 ether, "ReserveA should reflect combined liquidity");
        assertEq(liquidityPool.reserveB(), 300 ether, "ReserveB should reflect combined liquidity");
    }

    function test_RevertWhen_AddLiquidityExceedingBalance() public {
        vm.startPrank(user1);
        vm.expectRevert("Insufficient balance for tokenA");
        liquidityPool.addLiquidity(2000 ether, 2000 ether);
        vm.stopPrank();
    }

    function testReinitializePool() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(500 ether, 500 ether);
        vm.stopPrank();
        vm.prank(user2);
        liquidityPool.addLiquidity(500 ether, 500 ether);
        assertEq(liquidityPool.reserveA(), 1000 ether, "ReserveA should reflect reinitialization");
        assertEq(liquidityPool.reserveB(), 1000 ether, "ReserveB should reflect reinitialization");
    }

    function testWithdrawAllLiquidity() public {
        vm.startPrank(user1);
        liquidityPool.addLiquidity(100 ether, 100 ether);
        liquidityPool.removeLiquidity(100 ether);
        assertEq(liquidityPool.totalSupply(), 0, "Total supply should be zero after withdrawing all liquidity");
        assertEq(liquidityPool.reserveA(), 0, "ReserveA should be zero after withdrawing all liquidity");
        assertEq(liquidityPool.reserveB(), 0, "ReserveB should be zero after withdrawing all liquidity");
        vm.stopPrank();
    }
}
