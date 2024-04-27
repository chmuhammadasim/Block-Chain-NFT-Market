const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num); 

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
        it('Should Track Newly Created Item, Tranfer NFT from Seller to Market Place and Emit Offered event', async function() {
            await expect(marketplace.connect(addr1).makeItem(nft.address,1,toWei(1)))
            .emit(marketplace,"Offered")
            .withArgs(1,nft.address,1,toWei(1),addr1.address);
            expect(await nft.ownerOf(1)).equal(marketplace.address);
            const item = await marketplace.items(1);
            expect(item.itemId).equal(1);
            expect(item.nft).equal(nft.address);
            expect(item.tokenId).equal(1);
            expect(item.price).equal(toWei(1));
            expect(item.sold).equal(false);
        });
        it("should Fail is Price is Set to Zero",  function() {
            expect(
                marketplace.connect(addr1).makeItem(nft.address, 1, 0)
            ).to.be.revertedWith("Price Must Be Greater than Zero");
        });
    });
});