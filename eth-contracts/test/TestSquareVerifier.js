// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var Verifier = artifacts.require('Verifier');
var proof = require('../../zokrates/code/square/proof.json');

contract('Verifier', accounts => {
    describe('Test Zokrates', () => {
        // Test verification with correct proof
        // - use the contents from proof.json generated from zokrates steps
        it('should pass verification with correct proof', async () => {
            let contract = await Verifier.new({ from: accounts[0] });

            let a = proof.proof.a;
            let b = proof.proof.b;
            let c = proof.proof.c;
            let inputs = proof.inputs;

            let result = await contract.verifyTx(a, b, c, inputs);
            assert.equal(result, true);
        })

        // Test verification with incorrect proof
        it('should fail verification with incorrect proof', async () => {
            let contract = await Verifier.new({ from: accounts[0] });

            let a = proof.proof.a;
            let b = proof.proof.b;
            let c = proof.proof.c;
            let inputs = proof.inputs;

            let cheat = [...proof.inputs]
            cheat[cheat.length - 1] = cheat[cheat.length - 1].replace(/[01]$/, cheat[cheat.length - 1][65] == '1' ? '0' : '1')
    
            let result = await contract.verifyTx(a, b, c, cheat);
            assert.equal(result, false);
        })
    })

});



