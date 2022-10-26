/**
 * @format
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require('@openzeppelin/hardhat-upgrades');
module.exports = {
  solidity: "0.8.1", //0.8.17

};
