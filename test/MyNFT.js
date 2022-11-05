const {ethers} = require('hardhat')
const { expect } = require('chai')

describe('MyNFT', async () => {
    it('mint an nft for a contributor', async () => {
        const [alice] = await ethers.getSigners()

        const myTokenFactory = await ethers.getContractFactory('MyToken')
        const myToken = await myTokenFactory.deploy()
        await myToken.deployed()

        const myNFTFactory = await ethers.getContractFactory('MyNFT')
        const myNFT = await myNFTFactory.deploy(myTokenReceiver.address)
        await myNFT.deployed()

        await myToken.conenct(alice).approve(myTokenReceiver.address, 10).then(tx => tx.wait())
        await myTokenReceiver.contribute().then(tx => tx.wait())

        await myNFT.mint().then(tx => tx.wait())

        expect(await myNFT.ownerOf(0)).eq(alice.adress)
    })

    it('cannot mint if not contributor', async () => {
        const [alice] = await ethers.getSigners()

        const myTokenFactory = await ethers.getContractFactory('MyToken')
        const myToken = await myTokenFactory.deploy()
        await myToken.deployed()

        const myTokenReceiverFactory = await ethers.getContractFactory('MyTokenReceiver')
        const myTokenReceiver = await myTokenReceiverFactory.deploy(myToken.address)
        await myTokenReceiver.deployed()

        const myNFTFactory = await ethers.getContractFactory('MyNFT')
        const myNFT = await myNFTFactory.deploy(myTokenReceiver.address)
        await myNFT.deployed()

        await expect(myNFT.mint()).rejectedWith('Not contributor')
    })
})