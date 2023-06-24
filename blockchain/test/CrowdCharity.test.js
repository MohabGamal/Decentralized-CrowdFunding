/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/** @format */

const { expect } = require('chai')

describe('CrowdCharity', () => {
  let CrowdCharity
  let crowdcharity
  let owner, addr1, addr2

  beforeEach(async () => {
    CrowdCharity = await ethers.getContractFactory('CrowdCharity')
    crowdcharity = await CrowdCharity.deploy()
    const charityRewards = await hre.ethers.getContractAt(
      'CharityRewards',
      await crowdcharity.rewardContract()
    )
    // console.log(await crowdcharity.rewardContract());
    // console.log(charityRewards.address);

    ;[owner, addr1, addr2, _] = await ethers.getSigners()
    await crowdcharity.createCampaign(200)
  })

  describe('initiating a campaign', async () => {
    it('should set the right owner', async () => {
      const [_owner, ,] = await crowdcharity.getCampaign(1)
      expect(_owner).to.equal(owner.address)
    })
    it('should set the right target', async () => {
      const [, _target] = await crowdcharity.getCampaign(1)
      expect(_target).to.equal(ethers.BigNumber.from(200))
    })
    it('should set the right raised Amount', async () => {
      const [, , _raisedAmount] = await crowdcharity.getCampaign(1)
      expect(_raisedAmount).to.equal(ethers.BigNumber.from(0))
    })
    it('should set the right isopen', async () => {
      const [, , , _isOpen] = await crowdcharity.getCampaign(1)
      expect(_isOpen).to.equal(true)
    })

    it('should increase the campaign count when created', async () => {
      expect(await crowdcharity.campaignCount()).to.equal(2)
    })

    it('should emit campaign count and target and owner', async () => {
      expect(await crowdcharity.createCampaign(200))
        .to.emit(CrowdCharity, 'Started')
        .withArgs(200)
    })
  })

  describe('funding a campaign', async () => {
    it('should not fund if closed', async () => {
      await crowdcharity.connect(owner).closeCampaign(1)
      await expect(crowdcharity.fundCampaign(1)).to.be.revertedWith(
        'Sadly the campaign is closed by the its owner'
      )
    })
    it('should emit when calling fundcampaign the event', async () => {
      expect(await crowdcharity.connect(addr1).fundCampaign(1, { value: 10 }))
        .to.emit(CrowdCharity, 'Funded')
        .withArgs(1, 10, addr1.address, owner.address)
    })
    it('should fund the amount being given', async () => {
      await crowdcharity.connect(addr1).fundCampaign(1, { value: 10 })
      expect(await crowdcharity.funderAmount(1, addr1.address)).to.equal(10)
    })
  })

  describe('closing a campaign', () => {
    it('should let only the owner to close the campaign', async () => {
      await expect(
        crowdcharity.connect(addr1).closeCampaign(1)
      ).to.be.revertedWith('Only owner can close his/her campaign')
    })
    it('should let the campaign be closed once', async () => {
      await crowdcharity.closeCampaign(1)
      await expect(
        crowdcharity.connect(owner).closeCampaign(1)
      ).to.be.revertedWith('campaign is already closed')
    })
    it('should emit when calling close campaign', async () => {
      expect(await crowdcharity.closeCampaign(1))
        .to.emit(CrowdCharity, 'closed')
        .withArgs(1)
    })
  })
})
