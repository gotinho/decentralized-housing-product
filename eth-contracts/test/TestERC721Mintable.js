var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({ from: account_one });
            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1);
            await this.contract.mint(account_one, 2);
            await this.contract.mint(account_one, 3);
            await this.contract.mint(account_one, 4);
            await this.contract.mint(account_one, 5);
        })

        it('should return total supply', async function () {
            let totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply, 5);
        })

        it('should get token balance', async function () {
            let balance = await this.contract.balanceOf(account_one);
            assert.equal(balance, 5);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let tokenURI_1 = await this.contract.tokenURI(1);
            assert.equal(tokenURI_1, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1');
            let tokenURI_2 = await this.contract.tokenURI(2);
            assert.equal(tokenURI_2, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2');
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.safeTransferFrom(account_one, account_two, 1);
            let owner = await this.contract.ownerOf(1);
            assert.equal(owner, account_two);
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({ from: account_one });
        })

        it('should fail when minting when address is not contract owner', async function () {
            try {
                await this.contract.mint(account_one, 10, { from: account_two });
                assert.fail();
            } catch (error) {
                assert.exists(error);
            }
        })

        it('should return contract owner', async function () {
            await this.contract.mint(account_two, 1);
            let owner = await this.contract.ownerOf(1);
            assert.equal(owner, account_two);
        })

    });
})