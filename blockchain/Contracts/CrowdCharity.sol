// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import './CharityRewards.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './interfaces/IWETH9.sol';

/// @title Crowdfunding on blockchain
/// @author Mohab M. Gamal
/// @notice A smart contract for crowdfunding campaigns
/// @dev All function calls are currently implemented without side effects
contract CrowdCharity {
    CharityRewards public rewardContract = new CharityRewards(msg.sender);
    ISwapRouter public constant SWAPROUTER =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    uint256 public campaignsCount = 0;

    struct Campaign {
        address payable owner;
        uint256 target;
        uint256 raisedAmount;
        uint256 timeStamp;
        bool isOpen;
        string image;
        string title;
    }
    //CampaignID =>  (Funder => amount)
    // mapping (uint => mapping(address => uint)) public funderAmount;
    // mapping (uint => Campaign) public campaigns;
    Campaign[] public campaigns;

    event Started(
        address indexed campaignOwner,
        uint256 indexed campaignId,
        uint256 indexed campaignTimestamp,
        uint256 campaignTarget
    );

    event Funded(
        uint256 indexed campaignId,
        uint256 fundedAmount,
        uint256 indexed timestamp,
        address indexed funder,
        address campaignOwner
    );

    event Closed(
        uint256 indexed campaignId,
        address indexed campaignOwner,
        uint256 indexed timestamp
    );

    /// @notice Swaps a fixed amount of WETH for a maximum possible amount of DAI through Uniswap V3
    /// @dev though uses msg.value it is not a payable function. Hence, Must be called from a payable function
    /// @param _recipient The address that gets the equivilant DAI of msg.value
    /// @return _OutputAmount the equivilant DAI of msg.value
    function _swapExactInputSingle(
        address _recipient
    ) internal returns (uint256 _OutputAmount) {
        // convert eth to weth to be traded as a normal ERC20 token
        IWETH(WETH9).deposit{value: msg.value}();
        // approve Uniswap router to spend this contract weth
        IWETH(WETH9).approve(address(SWAPROUTER), msg.value);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: DAI,
                fee: 3000, // pool fee 0.3%
                recipient: _recipient,
                deadline: block.timestamp + 300, // 5 minutes(300 seconds)
                amountIn: msg.value,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        // swaping Weth to DAI function
        return SWAPROUTER.exactInputSingle(params);
    }

    /// @notice Swaps a fixed amount of any token for a maximum possible amount of DAI through Uniswap V3
    /// @param _inputAmount The amount of the token that user need to donate with
    /// @param _recipient The address that gets the equivilant DAI of msg.value
    /// @param _path abi encoded swap path of the token that requsted to be converted to DAI. Datatype is bytes
    /// @param _inputToken the token that user need to donate with
    /// @return _OutputAmount the equivilant DAI of msg.value
    function _swapExactInputMultihop(
        uint256 _inputAmount,
        address _recipient,
        bytes memory _path,
        address _inputToken
    ) internal returns (uint256 _OutputAmount) {
        // transfer input Token to this contract
        require(
            IERC20(_inputToken).transferFrom(
                msg.sender,
                address(this),
                _inputAmount
            ),
            'Your tokens transfer to this contract failed'
        );
        // approve Uniswap router to spend this contract input Token balance
        require(
            IERC20(_inputToken).approve(address(SWAPROUTER), _inputAmount),
            "Couldn't approve Uniswap router to spend this contract tokens"
        );

        ISwapRouter.ExactInputParams memory params = ISwapRouter
            .ExactInputParams({
                path: _path,
                recipient: _recipient,
                deadline: block.timestamp + 300, // 5 minutes(300 seconds)
                amountIn: _inputAmount,
                amountOutMinimum: 0
            });
        return SWAPROUTER.exactInput(params);
    }

    /// @notice funding campaigns in the native currency
    /// @dev It converts Eth to Weth under the hood
    /// @param _campaignId defines the index of targeted campaign
    function fundCampaignWithEth(uint256 _campaignId) external payable {
        require(
            campaigns[_campaignId].isOpen == true,
            'Sadly the campaign is closed by its owner'
        );
        require(
            campaigns[_campaignId].owner != msg.sender,
            "Campaign owner can't fund the campaign"
        );

        uint256 _fundedAmountInDai = _swapExactInputSingle(
            campaigns[_campaignId].owner
        );

        // funderAmount[_campaignId][msg.sender] += _fundedAmountInDai;
        campaigns[_campaignId].raisedAmount += _fundedAmountInDai;
        rewardContract.mint(msg.sender, 0, _fundedAmountInDai);

        emit Funded(
            _campaignId,
            _fundedAmountInDai,
            block.timestamp,
            msg.sender,
            campaigns[_campaignId].owner
        );
    }

    /// @notice funding campaigns in any token
    /// @param _campaignId defines the index of targeted campaign
    /// @param _inputToken the token that user need to donate with
    /// @param _path abi encoded swap path of the token that requsted to be converted to DAI. Datatype is bytes
    /// @param _inputToken the token that user need to donate with
    function fundCampaignWithToken(
        uint256 _campaignId,
        uint256 _inputAmount,
        bytes memory _path,
        address _inputToken
    ) external payable {
        require(
            campaigns[_campaignId].isOpen == true,
            'Sadly the campaign is closed by its owner'
        );
        require(
            campaigns[_campaignId].owner != msg.sender,
            "Campaign owner can't fund the campaign"
        );

        uint256 _fundedAmountInDai;

        if (_inputToken != DAI) {
            _fundedAmountInDai = _swapExactInputMultihop(
                _inputAmount,
                campaigns[_campaignId].owner,
                _path,
                _inputToken
            );
        } else {
            require(
                IERC20(_inputToken).transferFrom(
                    msg.sender,
                    campaigns[_campaignId].owner,
                    _inputAmount
                ),
                'Your tokens transfer to campaign owner failed'
            );
            _fundedAmountInDai = _inputAmount;
        }

        // funderAmount[_campaignId][msg.sender] += _fundedAmountInDai;
        campaigns[_campaignId].raisedAmount += _fundedAmountInDai;
        rewardContract.mint(msg.sender, 0, _fundedAmountInDai);

        emit Funded(
            _campaignId,
            _fundedAmountInDai,
            block.timestamp,
            msg.sender,
            campaigns[_campaignId].owner
        );
    }

    /** @notice Function to start a new campaign.
     * @param _target defines the goal amount need to be raised
     * @param _title defines the the title of the campaign
     */
    function createCampaign(
        uint256 _target,
        string calldata _title,
        string calldata _image
    ) external {
        require(_target > 0, 'Target amount must be greater than 0');
        require(bytes(_title).length != 0, "Title can't be empty");
        require(bytes(_image).length != 0, "image can't be empty");

        campaigns.push(
            Campaign({
                owner: payable(msg.sender),
                target: _target,
                raisedAmount: 0,
                timeStamp: block.timestamp,
                isOpen: true,
                title: _title,
                image: _image
            })
        );

        emit Started(
            campaigns[campaignsCount].owner, // owner
            campaignsCount, // id
            block.timestamp, // timestamp
            campaigns[campaignsCount].target // target
        );

        campaignsCount++;
    }

    /** @notice Function to close a campaign.
     * @param _campaignId defines the index of targeted campaign
     */
    function closeCampaign(uint256 _campaignId) external {
        require(
            campaigns[_campaignId].owner == msg.sender,
            'Only owner can close his/her campaign'
        );
        require(
            campaigns[_campaignId].isOpen == true,
            'campaign is already closed'
        );
        campaigns[_campaignId].isOpen = false;

        emit Closed(_campaignId, campaigns[_campaignId].owner, block.timestamp);
    }

    /** @notice Function to get a campaign's details.
     * @param _campaignId defines the index of targeted campaign
     */
    function getCampaign(
        uint256 _campaignId
    )
        public
        view
        returns (
            address payable owner,
            uint256 target,
            uint256 raisedAmount,
            bool isOpen,
            string memory image,
            string memory title
        )
    {
        return (
            campaigns[_campaignId].owner,
            campaigns[_campaignId].target,
            campaigns[_campaignId].raisedAmount,
            campaigns[_campaignId].isOpen,
            campaigns[_campaignId].image,
            campaigns[_campaignId].title
        );
    }

    /** @notice Function to get campaigns' details.
     */
    function getCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    function getCampaignsByIds(
        uint256[] memory campaignIds
    ) public view returns (Campaign[] memory) {

        Campaign[] memory matchingCampaigns = new Campaign[](
            campaignIds.length
        );
        uint256 matchingCount = 0;

        for (uint256 i = 0; i < campaignIds.length; i++) {
            if (campaignIds[i] < campaignsCount) {
                require(campaignIds[i] >= 0, "input id must be greater than 0");
                matchingCampaigns[matchingCount] = campaigns[campaignIds[i]];
                matchingCount++;
            }
        }

        // Create a new array with the correct length
        Campaign[] memory result = new Campaign[](matchingCount);

        // Copy the matching campaigns into the new array
        for (uint256 i = 0; i < matchingCount; i++) {
            result[i] = matchingCampaigns[i];
        }

        return result;
    }

    /** @notice receive & fallback are unique functions to receive ether as donation to this app
     */
    receive() external payable {}

    fallback() external payable {
        rewardContract.mint(msg.sender, 1, msg.value); // special reward only for our supports ;)
    }

    // Just for testing

    function dummy() external view returns (uint256) {
        return IERC20(DAI).balanceOf(msg.sender);
    }

    //     address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    //     function single_Swap_For_Testing(address _recipient, address _tokenOut)
    //         external
    //         payable
    //         returns (uint _OutputAmount)
    //     {
    //         IWETH(WETH9).deposit{value: msg.value}();

    //         IWETH(WETH9).approve(address(SWAPROUTER), msg.value);
    //         ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
    //         .ExactInputSingleParams({
    //             tokenIn: WETH9,
    //             tokenOut: _tokenOut,
    //             // pool fee 0.05%
    //             fee: 500,
    //             recipient: _recipient,//msg.sender,
    //             deadline: block.timestamp + 300, // 5 minutes(300 seconds)
    //             amountIn: msg.value,
    //             amountOutMinimum: 0,
    //             sqrtPriceLimitX96: 0
    //         });
    //         return _OutputAmount = SWAPROUTER.exactInputSingle(params);
    //     }
}

// /** @notice Function to fund a campaign.
//   * @param _campaignId defines the index of targeted campaign
//   */
// function fundCampaign(uint _campaignId) external payable{
//     require(campaigns[_campaignId].isOpen == true, "Sadly the campaign is closed by the its owner");
//     require(campaigns[_campaignId].owner != msg.sender, "Campaign owner can't fund the campaign");
//     require(campaigns[_campaignId].owner.send(msg.value), "transfering funds error");
//     funderAmount[_campaignId][msg.sender] += msg.value;
//     campaigns[_campaignId].raisedAmount += msg.value;

//     rewardContract.mint(msg.sender, 0, msg.value);

//     emit Funded(
//         _campaignId,
//         msg.value,
//         block.timestamp,
//         msg.sender,
//         campaigns[_campaignId].owner
//     );
// }
