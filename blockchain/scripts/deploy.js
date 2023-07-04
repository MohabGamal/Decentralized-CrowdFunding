/* eslint-disable no-undef */
/** @format */

async function main() {
  const [add1, add2] = await ethers.getSigners()
  console.log(`Deploying contracts with the account: ${add1.address}`)
  // const balance = await add1.getBalance();
  // console.log(`Account balance: ${balance.toString()}`);

  const CrowdCharity = await ethers.getContractFactory('CrowdCharity')
  const crowdcharity = await CrowdCharity.deploy()

  const REWARD_CONTRACT_ADDRESS = await crowdcharity.rewardContract()
  const charityrewards = await ethers.getContractAt(
    'CharityRewards',
    REWARD_CONTRACT_ADDRESS
  )

  console.log(`CrowdCharity address: ${crowdcharity.address}`)
  console.log(`CharityRewards address: ${charityrewards.address}`)

  await Promise.all([
    crowdcharity
      .connect(add1)
      .createCampaign(
        ethers.utils.parseEther('10000'),
        ethers.utils.parseEther('4000'),
        1,
        'test1',
        'https://images.unsplash.com/photo-1679267441399-d73d2640cf68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
      ),
    crowdcharity
      .connect(add2)
      .createCampaign(
        ethers.utils.parseEther('100'),
        ethers.utils.parseEther('40'),
        1,
        'test2',
        'https://images.unsplash.com/photo-1679556026240-6ea91e686cfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
      )
  ])
  // console.log(await crowdcharity.getCampaignsByIds([0, 1]))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
