// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract CrowdCharity {

    uint campaignCount = 1;
    struct Campaign {
        address payable owner;
        uint target;
        uint raisedAmount;
        //uint fundersCount;
        bool isOpen;
    }
            //CampaignID =>  (Funder => amount)
    mapping (uint => mapping(address => uint)) public funderAmount; 
    mapping(uint => Campaign) public campaigns;


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
}