import {ethers} from 'hardhat'
import {assert} from 'assert'

describe('Hello world', function(){
    it ('has initial message', async () => {
        const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
        const helloWorld = await helloWorldFactory.deploy();
        await helloWorld.deployed();

        assert.equal(await helloWorld.getMessage(), "Hola Mundo Profesional")
    })
})