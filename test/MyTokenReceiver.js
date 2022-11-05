// import {expect} from 'chai'
// import {ethers} from 'hardhat'

const {ethers} = require('hardhat')
const {expect} = require('chai')

async function deploy() {
    const myTokenFactory = await ethers.getContractFactory('MyToken')
    const myToken = await myTokenFactory.deploy()
    await myToken.deployed()
    return myToken
}

describe('MyTokenReceiver', () => {
    it('marks contributors', async () => {
        const [alice] = await ethers.getSigners()
        const myToken = await deploy()

        const myTokenReceiverFactory = await ethers.getContractFactory('MyTokenReceiver')
        const myTokenReceiver = await myTokenReceiverFactory.deploy(myToken.address)
        await myTokenReceiver.deployed()

        await myToken.connect(alice).approve(myTokenReceiver.address, 10).then(tx => tx.wait())
        await myTokenReceiver.contribute().mint().then(tx => tx.wait())

        expect(await myTokenReceiver.balanceOf(alice.address)).eq(90)
        expect(await myTokenReceiver.balanceOf(myTokenReceiver.address)).eq(10)
        expect(await myTokenReceiver.isContributor(alice.address)).eq(true)
    })
})