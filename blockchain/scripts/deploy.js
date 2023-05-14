/** @format */

async function main() {
  const [add1, add2] = await ethers.getSigners()
  console.log(`Deploying contracts with the account: ${add1.address}`)
  // const balance = await add1.getBalance();
  // console.log(`Account balance: ${balance.toString()}`);

  const CrowdCharity = await ethers.getContractFactory('CrowdCharity')
  const crowdcharity = await CrowdCharity.deploy()

  const rewardContractAddress = await crowdcharity.rewardContract()
  const charityrewards = await ethers.getContractAt(
    'CharityRewards',
    rewardContractAddress,
  )

  console.log(`CrowdCharity address: ${crowdcharity.address}`)
  console.log(`CharityRewards address: ${charityrewards.address}`)
  
  const [charityrewards1, charityrewards2,] = //crowdcharity1, crowdcharity2] =
    await Promise.all([
      charityrewards
        .connect(add1)
        .addToken(
          'Funding Points',
          'FP',
          'https://bafybeie2pa7gtnjetomxbywp4o4zeasrhk3dj653b324ddzufsculkwa7i.ipfs.w3s.link/Funding-Points.png',
        ),
      charityrewards
        .connect(add1)
        .addToken(
          'Supporting Points',
          'SP',
          'https://bafybeifbqmphvoaymvsqfhta74uyiqylvlsh3icg62bszxqepbainclxlu.ipfs.w3s.link/Supporting-Points.png',
        ),
      crowdcharity
        .connect(add1)
        .createCampaign(
          1e4,
          'testing',
          'https://images.unsplash.com/photo-1679267441399-d73d2640cf68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        ),
      crowdcharity
        .connect(add2)
        .createCampaign(
          1e2,
          'other',
          'https://images.unsplash.com/photo-1679556026240-6ea91e686cfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
        ),
    ])
  console.log(await crowdcharity.getCampaignsByIds([0, 1]))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
