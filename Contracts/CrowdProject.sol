// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./CrowdToken.sol";

contract CrowdProject {
    address projectOwner;
    address payable projectContract;
    uint numberOfMiletones;
    uint numberOfFundRaisers;
    uint projectTarget;
    uint minInvestment;
    uint maxInvestment;
    uint raisedAmount = address(this).balance;
    
    struct MileStone{
        uint deadline;
        uint amount;
        bool isCompleted;
    }
    mapping (uint => MileStone) milestones;
    mapping (address => uint) fundRaiserAmount; // address => Fund_Amount 

    event Created();
    event Funded();
    event Payedout();
    event Refunded();

    modifier onlyOnwer () {
        require(msg.sender == projectOwner, "Error: Owner only can access");
        _;
    }
    
    constructor(
        address payable _projectContract,
        uint _numberOfMiletones,
        uint _projectTarget,
        uint _minInvestment,
        uint _maxInvestment,
        uint[] memory _milestonesDeadlines,
        uint[] memory _milestonesAmounts
        ) {

        require(_numberOfMiletones > 0 , "Error: milestones must be at least 1");
        projectOwner = msg.sender; //
        projectContract = _projectContract;
        numberOfMiletones = _numberOfMiletones;
        projectTarget = _projectTarget;
        minInvestment = _minInvestment;
        maxInvestment = _maxInvestment;
        uint _totalAmounts;

        for (uint i=1; i <= _numberOfMiletones; i++){
            milestones[i] = MileStone({
                deadline: _milestonesDeadlines[i-1],
                amount: _milestonesAmounts[i-1],
                isCompleted: false
            });
            _totalAmounts += milestones[i].amount;
            if(i==1) require(milestones[i].deadline > block.timestamp, "Error: milestones must be in the future");
            if(i>1) require(milestones[i].deadline > milestones[i-1].deadline, "Error: milestones must be in the future of the last milestone");
        }
        require(_totalAmounts == _projectTarget, "Error: sum of milestones funds must be equal to the project goal");
        emit Created();
    }
    
    function fundProject() external payable{
        require(projectTarget >= raisedAmount && projectTarget >= msg.value, "Error: more funds than project goal");
        require(msg.value >= minInvestment, "Error: check min investment");
        require(msg.value + fundRaiserAmount[msg.sender] <= maxInvestment, "Error: check max investment");
        require(milestones[numberOfMiletones].deadline < block.timestamp,"Error: Project period is ended");

        if (fundRaiserAmount[msg.sender] == 0) {
            numberOfFundRaisers++;
        }
        require(payable(address(this)).send(msg.value), "Error: transfering funds error");
        fundRaiserAmount[msg.sender] += msg.value;
        raisedAmount += msg.value;

        emit Funded();
    }

    function payoutProject(uint _milestoneID) external onlyOnwer {
        require(milestones[_milestoneID].deadline < block.timestamp, "Error: this milestone hasn't met the deadline yet");
        require(milestones[_milestoneID].isCompleted == false, "Error: this milestone is already completed");
        require(milestones[_milestoneID].amount <= raisedAmount, "Error: insufficient funds");

        require(projectContract.send(milestones[_milestoneID].amount), "Error: transfering funds error");
        milestones[_milestoneID].isCompleted = true;
        emit Payedout();
    }

    function refund(uint _amount) external {
        require(fundRaiserAmount[msg.sender] >= _amount, "Error: input amount is less than your balance");
        
        require(payable(msg.sender).send(_amount), "Error: transfering funds error");
        fundRaiserAmount[msg.sender] -= _amount;
        raisedAmount -= _amount;

        if (fundRaiserAmount[msg.sender] == 0) {
            numberOfFundRaisers--;
        }
        emit Refunded();
    }


    // function s () public pure returns (uint){
    //     return 20;
    // }

    // function testCallFoo() public returns (bytes memory, bytes32, uint) {
    //     // You can send ether and specify a custom gas amount
    //     (bool success, bytes memory data) = address(this).call{gas: 5000}(
    //         abi.encodeWithSignature("s()s")
    //     );
        
    //     // bytes memory sd = abi.encodeWithSignature("s()d");
    //     // bytes4 kd = bytes4(sd);

    //     //require(bytes32(data) != 0x00,"bad");
    //     require(success);
    //     uint i = abi.decode(data,(uint));
    //     return (data, bytes32(data), i);
    // }

    // fallback(bytes calldata) external returns (bytes memory){
    //     (bool success, bytes memory data) = address(this).call{gas: 5000}(
    //         abi.encodeWithSignature("s()")
    //     );
    //     return data;
    // }
}