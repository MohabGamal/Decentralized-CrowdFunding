// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./CrowdProject.sol";

contract crowdFactory {
    CrowdProject[] public projects;

    struct Project{
        address projectOwner;
    }

    function addCrowdProject(address _smartContract) external returns (CrowdProject) {}

}