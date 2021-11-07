const fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = fs.readFileSync("eth-contracts/.secret").toString().trim();
const infuraKey = fs.readFileSync("eth-contracts/.infura").toString().trim();;

async function main(provider) {
    let web3 = new Web3(provider);

    let accounts = await web3.eth.getAccounts();

    let SolnSquareVerifier = require('./eth-contracts/build/contracts/SolnSquareVerifier.json');
    let networkId = await web3.eth.net.getId();
    let contractAddress = SolnSquareVerifier.networks[networkId].address;

    let contract = new web3.eth.Contract(SolnSquareVerifier.abi, contractAddress);
    let name = await contract.methods.name().call();
    console.log(`Minting new nft on ${name}`);

    for (let index = 0; index < 10; index++) {
        let proof = require(`./zokrates/code/square/proof_${index}.json`);
        let tokenId = index + 1;
        let a = await contract.methods.mintNewNFT(accounts[0], tokenId, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs).send({ from: accounts[0] });
        console.log(`Token id: ${tokenId} minted on transaction: ${a.transactionHash}`);
    }
}

let useRinkebyNetwork = true;

let provider = 'http://127.0.0.1:8545/';
if (useRinkebyNetwork) {
    provider = new HDWalletProvider(mnemonic, `wss://rinkeby.infura.io/ws/v3/${infuraKey}`)
}else{
    provider = new HDWalletProvider('bounce rabbit write palm celery fat sand solar frown swarm unfair human', `http://127.0.0.1:8545`)
}

main(provider);