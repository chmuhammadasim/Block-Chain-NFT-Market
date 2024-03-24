const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('NFTMarketPlace', function()  { 
    let deployer, addr1, addr2, nft, marketplace;
    let feePercent = 1;
    beforeEach( async function() {
        const NFT = await ethers.getContractFactory("NFT");
        const MarketPlace = await ethers.getContractFactory("MarketPlace");
        [ deployer, addr1, addr2 ] = await ethers.getSigners()
        nft = await NFT.deploy();
        marketplace = await MarketPlace.deploy(feePercent);
    })
    describe('Deployment', function() {
        it('Should Track Name and Symbol of NFT Collection', async function() {
            expect(await nft.name()).equal("DApp NFT");
            expect(await nft.symbol()).equal("DAPP");
        })
    })
 })