const {ethers} = require('hardhat')
const {expect} = require('chai')

describe('My Token', function(){
    it ('initial balance for deployer', async () => {

        const [deployer] = await ethers.getSigners()
        const myTokenFactory = await ethers.getContractFactory("MyToken");
        const myToken = await myTokenFactory.deploy();
        await myToken.deployed();
        expect(await myToken.balanceOf(deployer.address)).equal(100);
        console.log((await myToken.balanceOf(deployer.address)))
        myToken.transfer('0x0000000000000000000000000000000000000000', 100000); // null address
        myToken.transfer('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 50); // address, cantidad que quiero mandar
        myToken.transfer("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 10);
        expect(await myToken.balanceOf(deployer.address)).equal(40); // 50 -10 porque es lo que le mande a las otras dos direcciones
    })
})