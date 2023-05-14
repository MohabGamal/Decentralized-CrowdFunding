// connect to Ethereum
import { ethers } from 'ethers'

import {
  CONTRACT_ADDRESS,
  MAIN_CONTRACT_ABI,
  REWARD_CONTRACT_ADDRESS,
  REWARD_CONTRACT_ABI,
  JSON_RPC_ETHEREUM_PROVIDER,
} from './constants.js'

const provider = new ethers.providers.JsonRpcProvider(
  JSON_RPC_ETHEREUM_PROVIDER,
)

export const mainContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  MAIN_CONTRACT_ABI,
  provider,
)
export const rewardContract = new ethers.Contract(
  REWARD_CONTRACT_ADDRESS,
  REWARD_CONTRACT_ABI,
  provider,
)
