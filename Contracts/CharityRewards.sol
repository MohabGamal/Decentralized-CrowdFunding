// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CharityRewards is ERC1155, Ownable {
    
    address deployer;
    uint tokensCount = 0;
    mapping (uint => Token) public tokens;
    struct Token {
        string name;
        string uri;
    }

    event Added(
        uint tokenId,
        string tokenName,
        string tokenUri
    );

    constructor(address _deployer) ERC1155("") {
        deployer = _deployer;
    }

    /** @dev Function to allow admin to add new subtokens of the main ERC1155 token
      * @param _tokenName subtoken name 
      * @param _tokenUri subtoken uri(metadata location on the ipfs)
      */
    function addToken(
        string memory _tokenName,
        string memory _tokenUri
    ) public {
        require(msg.sender == deployer, "Original owner only can add tokens");

        tokens[tokensCount] = Token({
            name: _tokenName,
            uri: _tokenUri
        });
        emit Added(
            tokensCount,
            tokens[tokensCount].name,
            tokens[tokensCount].uri
        );
        tokensCount++;
    }

    /** @dev Function to mint(produce) a subtoken from outside of this contract (externally) 
      * @param _to      the doner  
      * @param _tokenId subtoken id 
      * @param _tokenAmount  number of subtokens to be produced and given to the function caller (_to)
      */
    function mint(address _to, uint256 _tokenId, uint256 _tokenAmount) public {
        _mint(_to, _tokenId, _tokenAmount, "");
    }

    /** @dev Function to mint(produce) subtokens from outside of this contract (externally) 
      * @param _to      the doner  
      * @param tokensIds subtokens ids 
      * @param tokensAmounts  number of subtokens to be produced and given to the function caller (_to)
      */
    function mintBatch(
        address _to,
        uint256[] memory tokensIds,
        uint256[] memory tokensAmounts
    ) public {
        _mintBatch(_to, tokensIds, tokensAmounts, "");
    }

    /** @dev overriden function to prevent all non-owner token holders from minting, transfering, and burning tokens aka soulbound tokens
      */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal view override onlyOwner{}

    /** @dev Function to get subtoken details
      * @param _tokenId subtoken id
      */ 
    function getToken(uint _tokenId) view public  
    returns (
        string memory _name,
        string memory _uri
    )  {
        return (
            tokens[_tokenId].name,
            tokens[_tokenId].uri
        );
    }

    // function dummy2(address a) pure  public returns (address){
    //     return a;
    // }

}