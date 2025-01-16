// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LiquidityPool - A contract manages a token pair liquidity pool.
 * @author Jitendra Kumar
 * @dev Implements a constant product AMM model with a 5% fee split (4% for liquidity providers and 1% for the contract).
 */
contract LiquidityPool is Ownable, ERC20 {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    uint256 public accumulatedFeesA;
    uint256 public accumulatedFeesB;
    uint256 public accumulatedContractFeesA;
    uint256 public accumulatedContractFeesB;

    mapping(address => uint256) public liquidityShares;
    address[] public liquidityProviders;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidityTokens);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidityTokens);
    event Swap(address indexed swapper, address tokenIn, uint256 amountIn, uint256 amountOut);
    event FeesDistributed(uint256 totalFeesA, uint256 totalFeesB);

    /**
     * @notice Initializes the liquidity pool contract with two ERC20 tokens.
     * @param _tokenA Address of the first token.
     * @param _tokenB Address of the second token.
     */
    constructor(address _tokenA, address _tokenB) ERC20("LiquidityPoolToken", "LPT") Ownable(msg.sender) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    /**
     * @notice Allows users to add liquidity to the pool.
     * @param amountA The amount of TokenA to add.
     * @param amountB The amount of TokenB to add.
     * @dev The amount of liquidity tokens minted is proportional to the amount of TokenA and TokenB added.
     */
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than zero");

        uint256 liquidityMinted;
        if (totalSupply() == 0) {
            liquidityMinted = sqrt(amountA * amountB);
        } else {
            liquidityMinted = min((amountA * totalSupply()) / reserveA, (amountB * totalSupply()) / reserveB);
        }

        require(liquidityMinted > 0, "Invalid liquidity amount");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        reserveA += amountA;
        reserveB += amountB;

        liquidityShares[msg.sender] += liquidityMinted;
        liquidityProviders.push(msg.sender);

        _mint(msg.sender, liquidityMinted);

        emit LiquidityAdded(msg.sender, amountA, amountB, liquidityMinted);
    }

    /**
     * @notice Allows users to remove liquidity from the pool.
     * @param liquidityTokens The amount of liquidity tokens to burn.
     * @dev The amount of TokenA and TokenB returned to the user is proportional to their liquidity share.
     */
    function removeLiquidity(uint256 liquidityTokens) external {
        require(balanceOf(msg.sender) >= liquidityTokens, "Insufficient liquidity shares");

        uint256 amountA = (liquidityTokens * reserveA) / totalSupply();
        uint256 amountB = (liquidityTokens * reserveB) / totalSupply();

        reserveA -= amountA;
        reserveB -= amountB;

        liquidityShares[msg.sender] -= liquidityTokens;
        _burn(msg.sender, liquidityTokens);

        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB, liquidityTokens);
    }

    /**
     * @notice Allows users to swap between TokenA and TokenB.
     * @param tokenIn The address of the token being swapped.
     * @param amountIn The amount of the input token.
     * @dev The contract uses a constant product AMM model to calculate the output amount.
     */
    function swap(address tokenIn, uint256 amountIn) external {
        require(amountIn > 0, "Amount must be greater than zero");

        bool isTokenAIn = tokenIn == address(tokenA);
        require(isTokenAIn || tokenIn == address(tokenB), "Invalid token address");

        IERC20 inputToken = isTokenAIn ? tokenA : tokenB;
        IERC20 outputToken = isTokenAIn ? tokenB : tokenA;
        uint256 inputReserve = isTokenAIn ? reserveA : reserveB;
        uint256 outputReserve = isTokenAIn ? reserveB : reserveA;

        inputToken.transferFrom(msg.sender, address(this), amountIn);

        uint256 amountOut = getAmountOut(amountIn, inputReserve, outputReserve);
        require(amountOut > 0, "Insufficient output amount");

        uint256 feeA = (amountIn * 4) / 100;
        uint256 feeB = (amountOut * 4) / 100;

        uint256 contractFeeA = (amountIn * 1) / 100;
        uint256 contractFeeB = (amountOut * 1) / 100;

        accumulatedFeesA += feeA;
        accumulatedFeesB += feeB;
        accumulatedContractFeesA += contractFeeA;
        accumulatedContractFeesB += contractFeeB;

        outputToken.transfer(msg.sender, amountOut - feeB - contractFeeB);

        if (isTokenAIn) {
            reserveA += amountIn - feeA - contractFeeA;
            reserveB -= amountOut - feeB - contractFeeB;
        } else {
            reserveB += amountIn - feeA - contractFeeA;
            reserveA -= amountOut - feeB - contractFeeB;
        }

        emit Swap(msg.sender, tokenIn, amountIn, amountOut - feeB - contractFeeB);
    }

    /**
     * @notice Distributes accumulated fees to liquidity providers.
     * @dev Liquidity providers receive a portion of the fees proportional to their liquidity share.
     */
    function distributeFeesDirectly() external {
        require(accumulatedFeesA > 0 || accumulatedFeesB > 0, "No fees to distribute");

        uint256 totalShares = totalLiquidityShares();
        require(totalShares > 0, "No liquidity in the pool");

        for (uint256 i = 0; i < liquidityProviders.length; i++) {
            address provider = liquidityProviders[i];
            uint256 sharePercentage = (liquidityShares[provider] * 1e18) / totalShares;

            uint256 providerFeeA = (sharePercentage * accumulatedFeesA) / 1e18;
            uint256 providerFeeB = (sharePercentage * accumulatedFeesB) / 1e18;

            if (providerFeeA > 0) tokenA.transfer(provider, providerFeeA);
            if (providerFeeB > 0) tokenB.transfer(provider, providerFeeB);
        }

        accumulatedFeesA = 0;
        accumulatedFeesB = 0;

        emit FeesDistributed(accumulatedFeesA, accumulatedFeesB);
    }

    /**
     * @notice Calculates the amount of output tokens for a given input amount using the AMM formula.
     * @param amountIn The amount of input tokens.
     * @param inputReserve The reserve of input tokens.
     * @param outputReserve The reserve of output tokens.
     * @return amountOut The amount of output tokens.
     */
    function getAmountOut(uint256 amountIn, uint256 inputReserve, uint256 outputReserve)
        public
        pure
        returns (uint256)
    {
        require(inputReserve > 0 && outputReserve > 0, "Invalid reserves");
        uint256 amountInWithFee = amountIn * 995;
        uint256 numerator = amountInWithFee * outputReserve;
        uint256 denominator = inputReserve * 1000 + amountInWithFee;
        return numerator / denominator;
    }

    /**
     * @notice Calculates the total amount of liquidity shares in the pool.
     * @return total The total liquidity shares in the pool.
     */
    function totalLiquidityShares() public view returns (uint256) {
        uint256 total;
        for (uint256 i = 0; i < liquidityProviders.length; i++) {
            total += liquidityShares[liquidityProviders[i]];
        }
        return total;
    }

    /**
     * @notice Returns the smaller of two numbers.
     * @param x First number.
     * @param y Second number.
     * @return The smaller number.
     */
    function min(uint256 x, uint256 y) internal pure returns (uint256) {
        return x < y ? x : y;
    }

    /**
     * @notice Calculates the square root of a number.
     * @param y The number.
     * @return z The square root of the number.
     */
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
