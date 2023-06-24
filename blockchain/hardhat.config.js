/* eslint-disable no-undef */
/**
 * @format
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-waffle')
require('solidity-coverage')
require('@openzeppelin/hardhat-upgrades')

require('dotenv').config()

let networks
if (!process.env.CI)
  networks = {
    hardhat: {
      chainId: 1337,
      forking: {
        url: process.env.ALCHEMY_API_URL
      }
    }
  }

module.exports = {
  solidity: {
    version: '0.8.1', //0.8.17
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks
}
