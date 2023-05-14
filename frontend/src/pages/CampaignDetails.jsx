import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { loader } from '../assets'
import { ethers } from 'ethers'
import { useStateContext } from '../context'
import { CountBox, CustomButton, Loader, UserRewards } from '../components'
import { useFetch } from '../hooks'
import { calculateBarPercentage } from '../utils'
// import { thirdweb } from '../assets';

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const CampaignDetails = () => {
  const { id } = useParams()
  // const navigate = useNavigate();
  const { mainContract, signer, address, connect } = useStateContext()

  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState(0)

  const {
    data: campaign,
    loading: iscampaignLoading,
    error: campaignError,
  } = useFetch(`http://localhost:8080/api/v1/campaigns/${id}`)
  // console.log(data, loading, error)
  
  const donate = async (id, amount) => {
    try {
      await mainContract.connect(signer).fundCampaignWithEth(id, {
        value: ethers.utils.parseEther(amount),
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const handleDonate = async () => {
    setIsLoading(true)
    const success = await donate(id, amount)

    if (success) toast.success('Funded!')
    else toast.error('Funding process went wrong!')
    // navigate('/')
    setIsLoading(false)
  }

  const closeCampaign = async id => {
    try {
      await mainContract.connect(signer).closeCampaign(id)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const handleClose = async () => {
    setIsLoading(true)
    const success = await closeCampaign(id)
    if (success) toast.success('Campaign closed!')
    else toast.error("Couldn't Close the campaign!")
    setIsLoading(false)
  }

  return (
    <div>
      {isLoading && <Loader />}
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          {campaign ? (
            <img
              src={campaign.image}
              alt="campaign"
              className="w-full h-[410px] object-cover rounded-xl"
            />
          ) : (
            <img
              src={loader}
              alt="loader"
              className="w-[100px] h-[100px] object-contain mx-auto"
            />
          )}
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${calculateBarPercentage(
                  campaign?.target,
                  campaign?.amountCollected,
                )}%`,
                maxWidth: '100%',
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox
            title="Status"
            value={campaign?.status}
            styles={
              campaign?.status === 'Open' ? 'text-[#1dc071]' : 'text-[#c70039]'
            }
          />
          <CountBox
            title={`Raised of ${campaign?.target}`}
            value={campaign?.amountCollected}
          />
          <CountBox title="Total Funds" value={campaign?.donations?.length} />
        </div>
      </div>
      {campaign?.owner === address && campaign?.status === 'Open' && (
        <div className="mt-5">
          <CustomButton
            btnType="button"
            title={address ? 'Close the campaign' : 'Connect'}
            styles={address ? 'bg-[#c70039]' : 'bg-[#8c6dfd]'}
            handleClick={handleClose}
          />
        </div>
      )}
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Creator
            </h4>
            {/* <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div> */}
            <div className="flex flex-row items-center">
              <h4 className="font-epilogue font-semibold text-[14px] text-white">
                {campaign?.owner}
              </h4>
              <UserRewards address={campaign?.owner} />
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Story
            </h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify break-all">
                {campaign?.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Funds
            </h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {campaign?.donations && campaign?.donations?.length > 0 ? (
                campaign?.donations.map((item, index) => (
                  <div
                    key={`${item.funder}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                        {item.funder}
                      </p>
                      <UserRewards address={item.funder} />
                    </div>
                    <p className="font-epilogue  text-[16px] font-bold text-white leading-[26px]">
                      {item.fundedAmount}$
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>
        {campaign?.status === 'Open' && (
          <div className="flex-1">
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Fund
            </h4>

            <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
              <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                Fund the campaign
              </p>
              <div className="mt-[30px]">
                <input
                  type="number"
                  placeholder="ETH 0.1"
                  step="0.01"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />

                <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                  <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                    Thanks Notation:
                  </h4>
                  <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                    {campaign?.message}
                  </p>
                </div>

                {address ? (
                  <CustomButton
                    btnType="button"
                    title="Fund Campaign"
                    styles="w-full bg-[#8c6dfd]"
                    handleClick={handleDonate}
                  />
                ) : (
                  <CustomButton
                    btnType="button"
                    title="Connect"
                    styles="w-full bg-[#8c6dfd]"
                    handleClick={connect}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CampaignDetails
