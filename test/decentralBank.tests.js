const assert = require('assert');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('DecentralBank', ([owner, customer]) => {
    let tether, rwd, decentralBank

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }
    
    before(async () => {
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        await rwd.transfer(decentralBank.address, tokens('1000000'))

        await tether.transfer(customer, tokens('100'), {from: owner})
    });
    
    describe('Mock Tether Deployment', async() => {
        it('matches name successfully', async() => {
            const name = await tether.name()
            assert.equal(name, 'Tether') 
        }); 
    });

    describe('Reward Token Deployement', async() => {
        it('matches name successfully', async() => {
            const name = await rwd.name()
            assert.equal(name, 'Reward Token')  
        });
    });

    describe('Decentral Bank Deployement', async() => {
        it('matches name successfully', async() => {
            const name = await decentralBank.name()
            assert.equal(name, 'Decentral Bank')  
        });

        it('this contract has tokens', async() => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        });

        describe('Yield Farming', async() => {
            it('rewards tokens for staking', async() => {
                let result;

                // Check customer balance before staking
                result = await tether.balanceOf(customer);
                assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')
                
                // Approve and deposit 100 tokens
                await tether.approve(decentralBank.address, tokens('100'), {from: customer})
                await decentralBank.depositTokens(tokens('100'), {from: customer})  // Changed from 0 to 100
                
                await decentralBank.issueTokens({from:owner});
                await decentralBank.issueTokens({from:customer}).should.be.rejected;

                await decentralBank.unstakeTokens({from:customer});

                // Check balances after staking
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after unstaking 100 tokens')
                
                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('0'), 'decentral bank mock wallet balance after staking')

                // Check staking status
                result = await decentralBank.isStaking(customer)
                assert.equal(result.toString(), 'false', 'customer is no longer staking status after unstaking')



            });
        });
    });
});