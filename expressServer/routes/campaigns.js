import express from 'express';
import {
    createCampaign,
    deleteCampaign,
    getCampaigns,
    updateCampaign
} from './../controllers/campaigns.js';

const router = express.Router()

router.get('/', getCampaigns)
router.post('/', createCampaign)
router.put('/:id', updateCampaign)
router.delete('/:id', deleteCampaign)


export default router