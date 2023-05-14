import request from 'supertest'

import app from '../server.js'
import { rewardContract } from '../config/ethers.js'

jest.mock('./../config/ethers.js', () => {
  return {
    rewardContract: {
      getToken: jest.fn(),
      balanceOf: jest.fn(),
    },
  }
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('get rewards', () => {
  // get rewards success
  it('should succeed to get rewards', async () => {
    const FP = {
      _name: 'Funding Points',
      _symbol: 'FP',
      _uri: 'https://bafybeie2pa7gtnjetomxbywp4o4zeasrhk3dj653b324ddzufsculkwa7i.ipfs.w3s.link/Funding-Points.png',
    }

    const SP = {
      _name: 'Supporting Points',
      _symbol: 'SP',
      _uri: 'https://bafybeifbqmphvoaymvsqfhta74uyiqylvlsh3icg62bszxqepbainclxlu.ipfs.w3s.link/Supporting-Points.png',
    }
    const expectedRewardTokens = {
      FPtoken: {
        name: 'Funding Points',
        symbol: 'FP',
        uri: 'https://bafybeie2pa7gtnjetomxbywp4o4zeasrhk3dj653b324ddzufsculkwa7i.ipfs.w3s.link/Funding-Points.png',
      },
      SPtoken: {
        name: 'Supporting Points',
        symbol: 'SP',
        uri: 'https://bafybeifbqmphvoaymvsqfhta74uyiqylvlsh3icg62bszxqepbainclxlu.ipfs.w3s.link/Supporting-Points.png',
      },
    }
    rewardContract.getToken.mockImplementation(index => {
      if (index === 0) {
        return FP
      } else if (index === 1) {
        return SP
      }
    })
    expect(jest.isMockFunction(rewardContract.getToken)).toBe(true)

    const res = await request(app).get('/api/v1/rewards/')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(expectedRewardTokens)
  })

  // get rewards failure if Error
  it('should fail to get rewards', async () => {
    rewardContract.getToken.mockImplementation(() => {
      throw new Error()
    })
    const res = await request(app).get('/api/v1/rewards/')
    expect(res.statusCode).toEqual(500)
  })
})

describe('get user rewards', () => {
  // get rewards success
  it('should succeed to get user rewards', async () => {
    const address = '0xBC91d2B233c0747d1EFD8EAB08bCfca7783b9c96'
    const expectedUserRewards = {
      FPbalance: 100,
      SPbalance: 200,
    }
    rewardContract.balanceOf.mockImplementation((address, index) => {
      if (index === 0) {
        return 100
      } else if (index === 1) {
        return 200
      }
    })
    expect(jest.isMockFunction(rewardContract.balanceOf)).toBe(true)

    const res = await request(app).get(`/api/v1/rewards/profiles/${address}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(expectedUserRewards)
  })

  // get rewards failure if invalid input
  it('should fail to get user rewards if `address` input is invalid', async () => {
    const addresses = [0, 'string', '0xBC91d2B233c0747', null, undefined]
    for (const address of addresses) {
      const res = await request(app).get(`/api/v1/rewards/profiles/${address}`)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toEqual([
        `"address" with value "${address}" fails to match the Ethereum address pattern`,
      ])
    }
  })

  // get rewards failure if Error
  it('should fail to get user rewards', async () => {
    rewardContract.balanceOf.mockImplementation(() => {
      throw new Error()
    })
    const address = '0xBC91d2B233c0747d1EFD8EAB08bCfca7783b9c96'
    const res = await request(app).get(`/api/v1/rewards/profiles/${address}`)
    expect(res.statusCode).toEqual(500)
  })
})
