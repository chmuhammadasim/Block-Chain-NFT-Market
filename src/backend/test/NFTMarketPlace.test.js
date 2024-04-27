const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('NFTMarketPlace', function()  { 
    let deployer, addr1, addr2, nft, marketplace;
    let feePercent = 1;
    let URI = "Simple URI"
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
        });
        it('Should Track Fee Account and Fee Percent of MarketPlace', async function() {
            expect(await marketplace.feeAccount()).equal(deployer.address);
            expect(await marketplace.feePercent()).equal(feePercent);
        });
    })
    describe("Minting NFTs", function() {
        it("Should Track Each Minted NFT", async function() {
            await nft.connect(addr1).mint(URI); 
            expect(await nft.tokenCount()).equal(1);
            expect(await nft.balanceOf(addr1.address)).equal(1);
            expect(await nft.tokenURI(1)).equal(URI);

            await nft.connect(addr2).mint(URI); 
            expect(await nft.tokenCount()).equal(2);
            expect(await nft.balanceOf(addr2.address)).equal(1);
            expect(await nft.tokenURI(2)).equal(URI);
        })
    })
    describe('Making MarketPlace Items', function() {
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(marketplace.address,true);
        })
    })
})