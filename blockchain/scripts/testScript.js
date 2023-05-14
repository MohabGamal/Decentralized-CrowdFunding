const main = async () => {
  const crowdcharity = await ethers.getContractAt(
    'CrowdCharity',
    '0xa195ACcEB1945163160CD5703Ed43E4f78176a54',
  )
  const charityrewards = await ethers.getContractAt(
    'CharityRewards',
    '0xFccd14557329cf11e7cC35c4e2BD4eB19E88f885',
  )

  const [_, __, add3, add4] = await ethers.getSigners()
  await crowdcharity
    .connect(add4)
    .fundCampaignWithEth(0, { value: ethers.utils.parseEther('1') })
  await crowdcharity
    .connect(add4)
    .fundCampaignWithEth(1, { value: ethers.utils.parseEther('1') })
  console.log('add4: ', add4.address)

  // console.log(await crowdcharity.campaignsCount())
  // console.log(await crowdcharity.getCampaignsByIds([0]))

  // const filter = crowdcharity.filters.Funded(0, null, null, null, null);
  // const filter = crowdcharity.filters.Funded(null, null, null, add4.address, null);
  // const events = await crowdcharity.queryFilter(filter)
  // const campaignsIds = events.map((event) => (Number(event.args.campaignId)))
  // const campaigns = await crowdcharity.getCampaignsByIds(campaignsIds)
  // console.log(campaigns)

  console.log(await charityrewards.balanceOf('0x90F79bf6EB2c4f870365E785982E1f101E93b906', 0)) // add4
  // console.log(await charityrewards.tokensCount());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
