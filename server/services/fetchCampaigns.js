import Campaign from '../models/Campaigns.js'
import { mainContract } from '../config/ethers.js'

export const fetchCampaigns = async (campaignsIds) => {
  const [contractData, dbData] = await Promise.all([
    mainContract.getCampaignsByIds(campaignsIds),
    Campaign.find({
      campaignId: { $in: campaignsIds },
    }),
  ])

  // console.log(await Campaign.find())

  const parsedCampaigns = contractData.map((campaign, i) => ({
    owner: campaign.owner,
    title: campaign.title,
    description: dbData[i].desc,
    category: dbData[i].category,
    message: dbData[i].message,
    target: parseInt(campaign.target),
    timeStamp: Number(campaign.timeStamp),
    status: campaign.isOpen ? 'Open' : 'Closed',
    amountCollected: parseInt(campaign.raisedAmount / 10 ** 18),
    image: campaign.image,
    pId: campaignsIds[i],
  }))
  return parsedCampaigns
}
