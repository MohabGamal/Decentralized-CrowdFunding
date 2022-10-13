// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import 'hardhat/console.sol';
contract Token{
    string public name = 'My Hardhat Token';
    string public symbol = 'MHT';
    uint public totalSupply = 1000000;
    address public owner;
    mapping(address => uint) balances;

    constructor(){
     balances[msg.sender] = totalSupply;
     owner = msg.sender;
    }

    function transfer(address _to, uint _amount) external{
        console.log('sender balance is %s tokens', balances[msg.sender]);
        console.log('Trying to send %s token to %s', _amount, _to);
        require(balances[msg.sender]>=_amount,'Not enough tokens');
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }
    function balanceof(address _account) external view returns(uint){
        return balances[_account];
    }
}