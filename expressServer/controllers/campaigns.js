import Campaign from '../models/Campaigns.js';

// POST /api/v1/campaigns/ 
export const createCampaign = async (req, res, next) => {
    const newCampaign = new Campaign(req.body)

    try {
        const savedCampaign = await newCampaign.save()
        res.status(200).json(savedCampaign)
    } catch (error) {
        // next() to go to the next middleware
        // (next used if the this middleware doesn't end req/res cycle)
        next(error) 
    }
}

// PUT /api/v1/campaigns/:id 
export const updateCampaign = async (req, res, next) => {
    try {
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // return the updated doc
        )
        res.status(200).json(updatedCampaign)
    } catch (error) {
        next(error)
    }
}

// DELETE /api/v1/campaigns/:id 
export const deleteCampaign = async (req, res, next) => {
    try {
        await Campaign.findByIdAndDelete(
            req.params.id,
        )
        res.status(200).json("Campaign deleted successfully")
    } catch (error) {
        next(error)
    }
}

// GET /api/v1/campaigns/ 
export const getCampaigns = async (req, res, next) => {
    const {limit, ...others} = req.query
    try {
        const campaigns = await Campaign.find(others).limit(Number(limit))
        res.status(200).json(campaigns)
    } catch (error) {
        next(error)
    }
}

