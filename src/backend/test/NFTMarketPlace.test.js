/* eslint-disable jest/valid-expect */
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
        it("should fail if price is set to zero", async function() {
            await expect(
                marketplace.connect(addr1).makeItem(nft.address, 1, 0)
            ).to.be.revertedWith("Price must be greater than 0");
        });            
    });
    describe('Buying MarketPlace Items', function() {
        let price = 2;
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(marketplace.address,true);
            await marketplace.connect(addr1).makeItem(nft.address,1,toWei(price));
        })
        it('Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event', async function() {
            const sellerInitalEthBal = await addr1.getBalance();
            const feeAccountInitalEthBal = await deployer.getBalance();

            let totalPriceInWei = await marketplace.getTotalPrice(1);

            await expect(marketplace.connect(addr2).purchaseItem(1,{value: totalPriceInWei}))
            .to.emit(marketplace,"Bought")
            .withArgs(1,nft.address,1,toWei(price),addr1.address,addr2.address);
            const sellerFinalEthBal = await addr1.getBalance();
            const feeAccountFinalEthBal = await deployer.getBalance();
            expect(parseFloat(fromWei(sellerFinalEthBal))).to.equal(parseFloat(price) + parseFloat(fromWei(sellerInitalEthBal)));
            const fee = (feePercent / 100) * price;
            expect(parseFloat(fromWei(feeAccountFinalEthBal))).to.equal(parseFloat(fee) + parseFloat(fromWei(feeAccountInitalEthBal)));
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            expect((await marketplace.items(1)).sold).to.equal(true);
        });
    });
});