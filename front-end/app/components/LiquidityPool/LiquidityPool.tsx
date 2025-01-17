"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { getContract, getContractA, getContractB } from "@/app/utils/constant";
import { LIQUIDITY_POOL_ADDRESS } from "@/constants";


export default function LiquidityPool() {
  const [activeTab, setActiveTab] = useState("mintAndApprove");
  const [tokenAAmount, setTokenAAmount] = useState("");
  const [tokenBAmount, setTokenBAmount] = useState("");
  const [mintTokenAAmount, setMintTokenAAmount] = useState("");
  const [mintTokenBAmount, setMintTokenBAmount] = useState("");
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [reserveABalance, setReserveABalance] = useState(0);
  const [reserveBBalance, setReserveBBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, address } = useAccount();


  useEffect(() => {
    if (isConnected) {
      fetchReserveBalance();
    }
  }, [isConnected]);


  const fetchReserveBalance = async () => {
    try {
      const contract = await getContract();
      const balanceA = await contract.reserveA();
      const balanceB = await contract.reserveB();
      setReserveABalance(balanceA.toString());
      setReserveBBalance(balanceB.toString());
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Error fetching reserve balance.");
    }
  };

  const mintAndApprove = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet!");
      return;
    }
    if (!mintTokenAAmount || !mintTokenBAmount) {
      toast.error("Please enter the token amount!")
      return;
    }

    try {
      setIsLoading(true);
      const contractA = await getContractA();
      const contractB = await getContractB();
      toast.loading("Wait for transaction.....");
      const mintTxnA = await contractA.mint(address, mintTokenAAmount);
      await mintTxnA.wait();
      const mintTxnB = await contractB.mint(address, mintTokenBAmount);
      await mintTxnB.wait();
      toast.dismiss();
      toast.success("Tokens minted successfully!");
      toast.loading("Wait for transaction.....");
      const approveTxnA = await contractA.approve(LIQUIDITY_POOL_ADDRESS, mintTokenAAmount);
      await approveTxnA.wait();
      const approveTxnB = await contractB.approve(LIQUIDITY_POOL_ADDRESS, mintTokenBAmount);
      await approveTxnB.wait();
      toast.dismiss();
      toast.success("Tokens approved successfully!");
      setMintTokenAAmount("");
      setMintTokenBAmount("");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Error minting tokens.");
    } finally {
      setIsLoading(false);
    }
  }


  const addLiquidity = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet!");
      return;
    }
    if (!tokenAAmount || !tokenBAmount) {
      toast.error("Please enter the token amount!")
      return;
    }
    const contractA = await getContractA();
    const contractB = await getContractB();
    const tokenABalance = await contractA.balanceOf(address);
    const tokenBBalance = await contractB.balanceOf(address);

    if (tokenAAmount > tokenABalance) {
      toast.error("Please enter the valid tokenA amount!");
      return;
    }
    if (tokenBAmount > tokenBBalance) {
      toast.error("Please enter the valid tokenB amount!");
      return;
    }
    try {
      setIsLoading(true);
      const contract = await getContract();
      toast.loading("Wait for transaction.....");
      const tx = await contract.addLiquidity(tokenAAmount, tokenBAmount);
      await tx.wait();
      toast.dismiss();
      toast.success("Liquidity added successfully!");
      fetchReserveBalance();
      setTokenAAmount("");
      setTokenBAmount("");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Error adding liquidity.");
    } finally {
      setIsLoading(false);
    }
  };


  const removeLiquidity = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet!");
      return;
    }
    if (!liquidityAmount) {
      toast.error("Please enter the valid liquidity Amount!")
      return;
    }
    try {
      setIsLoading(true);
      const contract = await getContract();
      toast.loading("Wait for transaction.....");
      const tx = await contract.removeLiquidity(liquidityAmount);
      await tx.wait();
      toast.dismiss();
      toast.success("Liquidity removed successfully!");
      fetchReserveBalance();
      setLiquidityAmount("");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Error removing liquidity.");
    } finally {
      setIsLoading(false);
    }
  };

  const swapTokens = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet!");
      return;
    }
    if (!selectedToken || !swapAmount) {
      toast.error("Please select a token and enter an amount to swap.");
      return;
    }
    if (swapAmount < "50") {
      toast.error("Please enter the token amount more than 50");
      return;
    }
    const tokenOut = selectedToken === "TokenA" ? "TokenB" : "TokenA";
    try {
      setIsLoading(true);
      const contract = await getContract();
      toast.loading("Wait for transaction.....");
      const tx = await contract.swap(selectedToken, swapAmount);
      await tx.wait();
      toast.dismiss();
      toast.success("Tokens swapped successfully!");
      fetchReserveBalance();
      setSelectedToken("");
      setSwapAmount("");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Error swapping tokens.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-10 px-4 sm:px-6 md:px-8 font-arcade">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setActiveTab("mintAndApprove")}
          className={`p-2 rounded-lg w-full text-center ${activeTab === "mintAndApprove"
            ? "bg-orange-900 text-white"
            : "bg-gray-600 text-gray-300"
            }`}
        >
          Faucet
        </button>
        <button
          onClick={() => setActiveTab("addLiquidity")}
          className={`p-2 rounded-lg w-full text-center ${activeTab === "addLiquidity"
            ? "bg-blue-600 text-white"
            : "bg-gray-600 text-gray-300"
            }`}
        >
          Add Liquidity
        </button>
        <button
          onClick={() => setActiveTab("removeLiquidity")}
          className={`p-2 rounded-lg w-full text-center ${activeTab === "removeLiquidity"
            ? "bg-red-600 text-white"
            : "bg-gray-600 text-gray-300"
            }`}
        >
          Remove Liquidity
        </button>
        <button
          onClick={() => setActiveTab("swapTokens")}
          className={`p-2 rounded-lg w-full text-center ${activeTab === "swapTokens"
            ? "bg-green-600 text-white"
            : "bg-gray-600 text-gray-300"
            }`}
        >
          Swap Tokens
        </button>
      </div>
      <div className="flex justify-center items-center w-full">
        {activeTab === "mintAndApprove" && (
          <div className="bg-gradient-to-b from-red-500 to-yellow-300 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md md:max-w-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
              Faucet
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="number"
                placeholder="Amount of Token A"
                value={mintTokenAAmount}
                onChange={(e) => setMintTokenAAmount(e.target.value)}
                className="p-3 bg-gray-200 text-gray-600 rounded-lg focus:outline-none"
              />
              <input
                type="number"
                placeholder="Amount of Token B"
                value={mintTokenBAmount}
                onChange={(e) => setMintTokenBAmount(e.target.value)}
                className="p-3 bg-gray-200 text-gray-600 rounded-lg focus:outline-none"
              />
              <button
                onClick={mintAndApprove}
                disabled={isLoading}
                className={`bg-orange-800 text-white p-3 rounded-lg hover:bg-orange-900 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Mint Tokens'}
              </button>
            </div>
          </div>
        )}
        {activeTab === "addLiquidity" && (
          <div className="bg-gradient-to-b from-red-500 to-yellow-300 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md md:max-w-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
              Add Liquidity
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="number"
                placeholder="Amount of Token A"
                value={tokenAAmount}
                onChange={(e) => setTokenAAmount(e.target.value)}
                className="p-3 bg-gray-200 text-gray-600 rounded-lg focus:outline-none"
              />
              <input
                type="number"
                placeholder="Amount of Token B"
                value={tokenBAmount}
                onChange={(e) => setTokenBAmount(e.target.value)}
                className="p-3 bg-gray-200 text-gray-600 rounded-lg focus:outline-none"
              />
              <button
                onClick={addLiquidity}
                disabled={isLoading}
                className={`bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Add Liquidity'}
              </button>
            </div>
          </div>
        )}
        {activeTab === "removeLiquidity" && (
          <div className="bg-gradient-to-b from-red-500 to-yellow-300 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md md:max-w-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
              Remove Liquidity
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="number"
                placeholder="Amount of Liquidity Tokens"
                value={liquidityAmount}
                onChange={(e) => setLiquidityAmount(e.target.value)}
                className="p-3 bg-gray-200 text-gray-600 rounded-lg focus:outline-none"
              />
              <button
                onClick={removeLiquidity}
                disabled={isLoading}
                className={`bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Remove Liquidity'}
              </button>
            </div>
          </div>
        )}
        {activeTab === "swapTokens" && (
          <div className="bg-gradient-to-b from-red-500 to-yellow-300 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md md:max-w-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
              Swap Tokens
            </h2>
            <div className="flex flex-col gap-4">
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="p-3 sm:p-4 bg-gray-100 text-gray-700 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-200 transition duration-300 w-full sm:w-auto"
              >
                <option value="">Select Token to Swap</option>
                <option value="0x8Bb9f8890DE8D676D138532D55683F5E19612FfD">
                  TokenA
                </option>
                <option value="0x24bFdE87f0f41c0A3Bf6Cd0E42bb75736ABA84A6">
                  TokenB
                </option>
              </select>
              <input
                type="number"
                placeholder="Amount to Swap"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                className="p-3 sm:p-4 bg-gray-100 text-gray-700 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
              />
              <div className="text-gray-800 text-end">
                <strong>Reserve Balance:</strong>{" "}
                {selectedToken === "0x8Bb9f8890DE8D676D138532D55683F5E19612FfD"
                  ? reserveBBalance
                  : reserveABalance}{" "}
                {selectedToken === "0x8Bb9f8890DE8D676D138532D55683F5E19612FfD"
                  ? "TokenB"
                  : "TokenA"}
              </div>
              <button
                onClick={swapTokens}
                disabled={isLoading}
                className={`bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Swap Tokens'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}