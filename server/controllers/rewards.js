import { rewardContract } from '../config/ethers.js'
import { ethAdressSchema } from '../validators/index.validator.js'
import JoiValidate from '../services/JoiValidate.js'
import logger from '../utils/logger.js';

class Token {
  constructor(name, symbol, uri) {
    this.name = name
    this.symbol = symbol
    this.uri = uri
  }
}

// GET /api/v1/rewards/profiles/:address
export const getUserRewards = async (req, res) => {
  const reqAddress = req.params.address
  const { address } = JoiValidate(ethAdressSchema, { address: reqAddress })

  const [FPbalance, SPbalance] = await Promise.all([
    rewardContract.balanceOf(address, 0),
    rewardContract.balanceOf(address, 1),
  ])

  res.status(200).json({
    FPbalance: parseInt(FPbalance / 10 ** 18),
    SPbalance: parseInt(SPbalance / 10 ** 18),
  })
}

// GET /api/v1/rewards/
export const getRewards = async (req, res) => {
  
  const [FP, SP] = await Promise.all([
    rewardContract.getToken(0),
    rewardContract.getToken(1),
  ])

  const FPtoken = new Token(FP._name, FP._symbol, FP._uri)
  const SPtoken = new Token(SP._name, SP._symbol, SP._uri)

  res.status(200).json({ FPtoken, SPtoken })
}
