import Campaign from '../models/Campaigns.js'
import JoiValidate from '../services/JoiValidate.js'
import { mainContract } from '../config/ethers.js'
import { fetchCampaigns } from '../services/fetchCampaigns.js'
import {
  mongoIdSchema,
  ethAdressSchema,
} from '../validators/index.validator.js'
import {
  campaignCreationSchema,
  campaignQuerySchema,
  campaignIdSchema,
  campaignUpdateSchema,
} from '../validators/campaigns.validator.js'

// POST /api/v1/campaigns/
export const addCampaign = async (req, res) => {
  const validatedBody = JoiValidate(campaignCreationSchema, req.body)
  const newCampaign = new Campaign(validatedBody)
  const savedCampaign = await newCampaign.save()
  res.status(201).json(savedCampaign)
}

// PATCH /api/v1/campaigns/:id
export const updateCampaign = async (req, res) => {
  const reqId = req.params.id
  const { id } = JoiValidate(mongoIdSchema, { id: reqId })
  const validatedBody = JoiValidate(campaignUpdateSchema, req.body)

  const updatedCampaign = await Campaign.findByIdAndUpdate(
    id,
    { $set: validatedBody },
    { new: true },
  )

  res.status(200).json(updatedCampaign)
}

// DELETE /api/v1/campaigns/:id
export const deleteCampaign = async (req, res) => {
  const reqId = req.params.id
  const { id } = JoiValidate(mongoIdSchema, { id: reqId })

  await Campaign.findByIdAndDelete(id)
  res.status(200).json({ message: 'Campaign deleted successfully' })
}

// GET /api/v1/campaigns/
export const getCampaigns = async (req, res) => {
  const { limit, page } = JoiValidate(campaignQuerySchema, req.query)

  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const campaignsIds = [...Array(limit).keys()]
    .map(i => i + startIndex)
    .filter(i => i < endIndex) // 4 => [0, 1, 2, 3]

  const campaigns = await fetchCampaigns(campaignsIds)
  res.status(200).json(campaigns)
}

// GET /api/v1/campaigns/profiles/:address
export const getUserCampaigns = async (req, res) => {
  const reqAddress = req.params.address
  const { address } = JoiValidate(ethAdressSchema, { address: reqAddress })
  const filter = mainContract.filters.Funded(null, null, null, address, null)
  const events = await mainContract.queryFilter(filter)

  // Set data-structure is used to remove duplicates
  let campaignsIds = new Set(events.map(event => Number(event.args.campaignId)))
  campaignsIds = Array.from(campaignsIds) // convert back to array

  const campaigns = await fetchCampaigns(campaignsIds)
  res.status(200).json(campaigns)
}

// GET /api/v1/campaigns/donations/:campaignId
export const getDonations = async (req, res) => {
  const reqCampaignId = req.params.campaignId
  const { campaignId } = JoiValidate(campaignIdSchema, {
    campaignId: reqCampaignId,
  })

  const filter = mainContract.filters.Funded(campaignId, null, null, null, null)
  const events = await mainContract.queryFilter(filter)

  const donations = events.map(event => ({
    funder: event.args.funder,
    fundedAmount: parseInt(event.args.fundedAmount / 10 ** 18),
  }))
  console.log(donations)
  res.status(200).json(donations)
}

// GET /api/v1/campaigns/:campaignId
export const getCampaignById = async (req, res) => {
  const reqCampaignId = req.params.campaignId
  const { campaignId } = JoiValidate(campaignIdSchema, {
    campaignId: reqCampaignId,
  })

  const campaign = await fetchCampaigns([campaignId])

  const filter = mainContract.filters.Funded(campaignId, null, null, null, null)
  const events = await mainContract.queryFilter(filter)

  const donations = events.map(event => ({
    funder: event.args.funder,
    fundedAmount: parseInt(event.args.fundedAmount / 10 ** 18),
  }))
  // console.log(events)
  res.status(200).json({ ...campaign[0], donations })
}
