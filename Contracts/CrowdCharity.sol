// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "./CharityRewards.sol";

contract CrowdCharity {

    CharityRewards public rewardContract = new CharityRewards(msg.sender);
    uint public campaignCount = 1;
    struct Campaign {
        address payable owner;
        uint target;
        uint raisedAmount;
        bool isOpen;
    }
    //CampaignID =>  (Funder => amount)
    mapping (uint => mapping(address => uint)) public funderAmount; 
    mapping (uint => Campaign) public campaigns;


    event Started(
        uint campaignId,
        uint campaignTarget,
        address indexed campaignOwner
    );

    event Funded(
        uint campaignId,
        uint fundedAmount,
        address indexed funder,
        address indexed campaignOwner
    );

    event Closed(
        uint campaignId,
        address indexed campaignOwner,
        bool isOpen
    );

    /** @dev Function to start a new campaign.
      * @param _campaignTarget defines the goal amount need to be raised  
      */
    function createCampaign(uint _campaignTarget) external  {
        campaigns[campaignCount] = Campaign({
            owner: payable (msg.sender),
            target: _campaignTarget,
            raisedAmount: 0,
            isOpen: true
        });

        emit Started(
            campaignCount,
            campaigns[campaignCount].target,
            campaigns[campaignCount].owner
        );
        campaignCount++;
    }

    /** @dev Function to fund a campaign.
      * @param _campaignId defines the index of targeted campaign  
      */    
    function fundCampaign(uint _campaignId) external payable{
        require(campaigns[_campaignId].isOpen == true, "Sadly the campaign is closed by the its owner");
        require(campaigns[_campaignId].owner.send(msg.value), "Error: transfering funds error");
        funderAmount[_campaignId][msg.sender] += msg.value;
        campaigns[_campaignId].raisedAmount += msg.value;

        rewardContract.mint(msg.sender, 0, msg.value);

        emit Funded(
            _campaignId,
            msg.value,
            msg.sender,
            campaigns[_campaignId].owner
        );
    }

    /** @dev Function to close a campaign.
      * @param _campaignId defines the index of targeted campaign  
      */   
    function closeCampaign(uint _campaignId) external {
        require(campaigns[_campaignId].owner == msg.sender, "Only owner can close his/her campaign");
        require(campaigns[_campaignId].isOpen == true, "campaign is already closed");
        campaigns[_campaignId].isOpen = false;

        emit Closed (
            _campaignId,
            campaigns[_campaignId].owner,
            campaigns[_campaignId].isOpen
        );

    }

    /** @dev Function to get a campaign's details.
      * @param _campaignId defines the index of targeted campaign  
      */ 
    function getCampaign(uint _campaignId) view public 
    returns 
    (
        address payable owner,
        uint target,
        uint raisedAmount,
        bool isOpen
    ) {
        return (
            campaigns[_campaignId].owner,
            campaigns[_campaignId].target,
            campaigns[_campaignId].raisedAmount,
            campaigns[_campaignId].isOpen
        );
    }

    // function dummy() view public returns(address){
    //     address ad = rewardContract.dummy2(msg.sender);
    //     return ad;
    // }

    /** @dev receive & fallback unique functions to receive ether as donation to the app
      */ 
    receive() external payable {}
    fallback() external payable {
        rewardContract.mint(msg.sender, 1, msg.value); // special reward only for our supports ;) 
    }
}