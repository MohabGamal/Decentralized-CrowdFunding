// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract EthereumWallet {
    address payable owner;

    modifier ownerOnly() {
        require(msg.sender == owner, "only the owner can call this function");
        _;
    }

  constructor() {
        owner = payable(msg.sender);
    }
    function deposit() public payable {}

    function send(address payable _recipient) public payable ownerOnly {
        _recipient.transfer(msg.value);
    }

     function balance() public view returns (uint) {
        return address(this).balance;
     }

     function withdraw(uint _amount) external ownerOnly {   
        payable(msg.sender).transfer(_amount);
         
    }
    function getOwner ( ) public view returns ( address ) {
        return owner ;
   }
}