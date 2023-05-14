import asyncHandler from 'express-async-handler'
import express from 'express'
import {
  addCampaign,
  deleteCampaign,
  getCampaigns,
  updateCampaign,
  getDonations,
  getUserCampaigns,
  getCampaignById
} from './../controllers/campaigns.js'

const router = express.Router()

router.get('/', asyncHandler(getCampaigns))
router.post('/', asyncHandler(addCampaign))
router.get('/donations/:campaignId', asyncHandler(getDonations))
router.get('/:campaignId', asyncHandler(getCampaignById))
router.get('/profiles/:address', asyncHandler(getUserCampaigns))
router.patch('/:id', asyncHandler(updateCampaign))
router.delete('/:id', asyncHandler(deleteCampaign))

export default router
