# NFT Marketplace

## Introduction

This project aims to develop a decentralized marketplace for trading Non-Fungible Tokens (NFTs). NFTs represent unique digital assets, such as digital art, collectibles, and virtual real estate, and are typically traded on blockchain platforms. The marketplace provides a platform for users to create, buy, sell, and trade NFTs securely and transparently.

## Technology Stack & Tools

- **Solidity**: Solidity is a high-level programming language used for writing smart contracts on the Ethereum blockchain.
- **Javascript (React & Testing)**: React is a popular JavaScript library for building user interfaces. It is used here for the frontend development of the marketplace. Testing frameworks are also implemented in JavaScript.
- **[Ethers](https://docs.ethers.io/v5/)**: Ethers is a JavaScript library used for interacting with the Ethereum blockchain. It provides a simple and efficient way to interact with smart contracts.
- **[Hardhat](https://hardhat.org/)**: Hardhat is a development environment for Ethereum projects. It facilitates tasks such as compiling, deploying, testing, and debugging smart contracts.
- **[IPFS](https://ipfs.io/)**: IPFS (InterPlanetary File System) is a decentralized storage protocol used for storing metadata associated with NFTs. It ensures data integrity and availability without relying on a central server.
- **[React Router](https://v5.reactrouter.com/)**: React Router is a library used for routing in React applications. It enables navigation between different components of the frontend application.

## Requirements For Initial Setup

To set up and run the NFT marketplace locally, follow these steps:

### 1. Clone/Download the Repository

Clone or download the project repository from the source.

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies using npm:

```bash
$ cd nft_marketplace
$ npm install
```

### 3. Boot up local development blockchain

Start a local Ethereum blockchain for development using Hardhat:

```bash
$ cd nft_marketplace
$ npx hardhat node
```

### 4. Connect development blockchain accounts to Metamask

- Copy the private keys of the generated accounts from the local blockchain and import them into MetaMask.
- Connect MetaMask to the Hardhat blockchain network (127.0.0.1:8545).

### 5. Migrate Smart Contracts

Deploy the smart contracts to the local blockchain:

```bash
$ npx hardhat run src/backend/scripts/deploy.js --network localhost
```

### 6. Run Tests

Execute tests to ensure the functionality of smart contracts:

```bash
$ npx hardhat test
```

### 7. Launch Frontend

Start the frontend application:

```bash
$ npm run start
```

## License

This project is licensed under the MIT License, which permits commercial use, modification, distribution, and private use.

For more details, refer to the LICENSE file included in the repository.

## Conclusion

The NFT marketplace provides a comprehensive environment for trading unique digital assets securely and efficiently. By leveraging blockchain technology and decentralized storage, it ensures transparency, immutability, and accessibility for users worldwide.
