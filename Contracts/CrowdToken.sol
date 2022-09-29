// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CrowdToken is ERC20 {
  //add minter variable
  address public minter;
  //add minter changed event
  event MinterChanged(address indexed from, address to);

  constructor(string memory _tokenName, string memory _tokenSymbol) ERC20(_tokenName, _tokenSymbol) {
    //asign initial minter
    minter = msg.sender;
  }

  //Add pass minter role function
  function passMinterRole(address oldMinter) public returns(bool) {
    require(msg.sender == minter, "Only Owner can pass Minter role");
    minter = oldMinter;

    emit MinterChanged(msg.sender,oldMinter);
    return true;
  }

  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role
    require(msg.sender == minter, "Only Minter can mint");
		_mint(account, amount);
	}

receive() external payable {}
}