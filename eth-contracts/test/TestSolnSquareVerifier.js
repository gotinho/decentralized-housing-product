var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');

var proof = require('../../zokrates/code/square/proof.json');


contract('SolnSquareVerifier', accounts => {

    describe('Test SolnSquareVerifier', () => {

        beforeEach(async () => {
            let verifier = await Verifier.new({ from: accounts[0] });
            this.contract = await SolnSquareVerifier.new(verifier.address, { from: accounts[0] });
        });

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('add new solution', async () => {
            let hash = web3.utils.keccak256(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
            await this.contract.addSolution(accounts[0], hash);
        });


        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should mint token', async () => {
            await this.contract.mintNewNFT(accounts[1], 1, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, { from: accounts[0] });
            let owner = await this.contract.ownerOf(1);
            assert.equal(owner, accounts[1]);

            try {
                await this.contract.mintNewNFT(accounts[1], 2, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, { from: accounts[0] });
                assert.fail();
            } catch (error) {
                assert.exists(error);
            }

            let totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply, 1);
        });
    });
});
