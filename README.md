# Peer2Play Swap 🎰
**Peer2Play Swap** is a decentralized liquidity pool contract that facilitates the swapping and liquidity provision of two ERC20 tokens. It implements a **constant product AMM model** with a **5% fee split** (4% for liquidity providers and 1% for the contract), ensuring a fair and efficient environment for token swaps and liquidity mining.

---
### 🚀 Features
- **Decentralized Liquidity Pool**: A smart contract-based pool for token swaps between two ERC20 tokens.
- **Constant Product AMM**: Uses the constant product formula for swap calculations (x * y = k).
- **Liquidity Provider Incentives**: 4% of swap fees distributed to liquidity providers.
- **Contract Fee**: 1% of swap fees go to the contract.
- **Fair Fee Distribution**: Fees are distributed proportionally based on liquidity shares.
- **Flexible Liquidity Addition and Removal**: Liquidity can be added or removed in proportion to shares in the pool.
- **Provably Fair Swaps**: Token swaps are based on a constant product model for fair pricing.
- **Event Logging**: Tracks key events such as liquidity addition/removal, swaps, and fee distributions.
---

### 🛠 Requirements
Before you start, ensure that you have the following installed:
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Foundry](https://getfoundry.sh/)

### ⚡ Quickstart
Clone the repository and set up your environment:
```
$ git clone https://github.com/jitendragangwar123/Peer2Play-Swap
$ cd Peer2Play-Swap
$ make install
$ forge build
```

### 🌍 Deployment to a Testnet or Mainnet

#### 1. Setup Environment Variables

You'll need to set your `SEPOLIA_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file in your project directory.

Optionally, you can also add your `ETHERSCAN_API_KEY` if you want to verify your contract on [Etherscan](https://etherscan.io/).

#### 2. Get Testnet ETH

Head over to [faucets.chain.link](https://faucets.chain.link/) to get some testnet ETH. The ETH should show up in your MetaMask wallet shortly.

#### 3. Deploy to Sepolia Testnet

To deploy your contract to the **Sepolia** testnet, run:

```
$ make deploy ARGS="--network sepolia"
```

### 🧪 Testing

You can run tests in various environments:

1. **Unit Tests**
2. **Integration Tests**
3. **Forked Network Tests**
4. **Staging Tests**

To run all tests, use:

```
$ forge test
```
or

```
$ forge test --fork-url $SEPOLIA_RPC_URL
```

### Test Coverage

```
$ forge coverage
```

### ⛽ Estimate Gas

You can estimate how much gas transactions will cost by running:

```
$ forge snapshot
```

And you'll see an output file called `.gas-snapshot`

### 📝 Formatting

To run code formatting, use the following command:

```
$ forge fmt
```

## 🌐 Front-End

### ⚡ Quickstart
```
$ cd front-end

# Create .env file in the front-end
NEXT_PUBLIC_PROJECT_ID=paste_your_walletconnect_project_id_here

# Install the dependencies
$ npm i

# Start the client
$ npm run dev
```
