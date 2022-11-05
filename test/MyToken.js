const {ethers} = require('hardhat')
const {expect} = require('chai')

// import {ethers} from 'hardhat'
// import {expect} from 'chai'

async function deploy() {
    const myTokenFactory = await ethers.getContractFactory('MyToken')
    const myToken = await myTokenFactory.deploy()
    await myToken.deployed()
    return myToken
}

describe('My Token', () => {
    describe('mint', () => {
        it('mint success', async () =>{
            const myToken = await deploy()

            const [alice, bob] = await ethers.getSigners()

            const tx = await myToken.connect(bob).mint()
            await tx.wait()

            expect(await myToken.balanceOf(bob.address)).to.equal(10)
        })

        it('mint fail', async () =>{
            const myToken = await deploy()
            
            const [alice, bob] = await ethers.getSigners()

            const tx = await myToken.connect(bob).mint()
            await tx.wait()

            await expect(myToken.connect(bob).mint()).revertedWith('Too early')
        })

        it('mint success after time', async () =>{
            const myToken = await deploy()
            
            const [alice, bob] = await ethers.getSigners()

            const tx = await myToken.connect(bob).mint()
            await tx.wait()

            for(let i = 0; i < 5; i++){
                await ethers.provider.send('evm_mine', [])
            }

            const otherTx = await myToken.connect(bob).mint()
            await otherTx.wait()
            expect(await myToken.balanceOf(bob.address)).to.equal(20)
        })
    })
    
    describe('admin block period', () => {
        //initial time is 5 blocks
        //owner can change time
        it('not owner cannot change time', async() => {
            const myToken = await deploy()

            const [, mallory] = await ethers.getSigners()
            await expect(myToken.connect(mallory).changeBlockPeriod(1)).rejectedWith('Only owner')
        })
    })
    // it ('mint', async () => {  
    //     const [deployer] = await ethers.getSigners()
    //     const myTokenFactory = await ethers.getContractFactory("MyToken");
    //     const myToken = await myTokenFactory.deploy();
    //     await myToken.deployed();
    //     expect(await myToken.balanceOf(deployer.address)).equal(100);
    //     console.log((await myToken.balanceOf(deployer.address)))
    //     myToken.transfer('0x0000000000000000000000000000000000000000', 100000); // null address
    //     myToken.transfer('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 50); // address, cantidad que quiero mandar
    //     myToken.transfer("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 10);
    //     expect(await myToken.balanceOf(deployer.address)).equal(40); // 50 -10 porque es lo que le mande a las otras dos direcciones
    // })
})
