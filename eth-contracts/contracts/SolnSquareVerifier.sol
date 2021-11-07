pragma solidity >=0.4.21 <0.6.0;

import "./verifier.sol";
import "./ERC721Mintable.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {
    // TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
    Verifier private _verifier;

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address solnAddress;
    }

    // TODO define an array of the above struct
    Solution[] private _allSolutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) _uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 indexed index, address indexed solnAddress);

    constructor(address verifierAddress) public {
        _verifier = Verifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address solnAddress, bytes32 solnHash) public {
        Solution memory soln;
        soln.index = _allSolutions.length + 1;
        soln.solnAddress = solnAddress;
        _allSolutions.push(soln);
        _uniqueSolutions[solnHash] = soln;
        emit SolutionAdded(soln.index, solnAddress);
    }

    function unique(bytes32 hashSolution) internal view returns (bool) {
        uint256 solnIndex = _uniqueSolutions[hashSolution].index;
        return solnIndex == 0;
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintNewNFT(
        address to,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        bytes32 solnHash = keccak256(abi.encodePacked(a, b, c, input));
        require(unique(solnHash));
        require(_verifier.verifyTx(a, b, c, input));
        addSolution(msg.sender, solnHash);
        mint(to, tokenId);
    }
}
