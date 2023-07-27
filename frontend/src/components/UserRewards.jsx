<<<<<<< HEAD
import { useFetch } from '../hooks'

function UserRewards({ address }) {
  const {
    data: rewardTokens,
    loading: isRewardTokensLoading,
    error: rewardTokensError
  } = useFetch('http://localhost:8080/api/v1/rewards/')

  const {
    data: userRewardsBalances,
    loading: isUserRewardsBalancesLoading,
    error: userRewardsBalancesError
  } = useFetch(
    `http://localhost:8080/api/v1/rewards/profiles/${address}/`,
=======
import React from 'react'
import { useFetch } from '../hooks'

import PropTypes from 'prop-types'

function UserRewards({ address }) {
  const { data: rewardTokens } = useFetch(
    'http://localhost:8000/api/v1/rewards/'
  )

  const { data: userRewardsBalances } = useFetch(
    `http://localhost:8000/api/v1/rewards/profiles/${address}/`,
>>>>>>> release
    {},
    [address]
  )
  return (
    <>
      {userRewardsBalances?.map((userBalance, i) => {
        if (userBalance > 0)
          return (
            <div key={i} className="relative flex group">
              <img
                src={rewardTokens[i]?.uri}
                alt={rewardTokens[i]?.name}
                className="w-[30px] h-[35px] ml-1 cursor-pointer hover:scale-105"
              />
              <span className="absolute right-0 transition-opacity opacity-0 pointer-events-none dark:text-white -top-7 w-max sm:group-hover:opacity-100">
                {userBalance} {rewardTokens[i]?.name}
              </span>
            </div>
          )
      })}
    </>
  )
<<<<<<< HEAD

  // return (
  //   <>
  //     {userRewards && rewards && (
  //       <div className="flex">
  //         {userRewards['FPbalance'] > 0 && (
  //           <div className="relative group ">
  //             <img
  //               src={rewards['FPtoken']?.uri}
  //               alt="FPtoken"
  //               className="w-[30px] h-[35px] ml-1 cursor-pointer"
  //             />
  //             <span className="absolute right-0 transition-opacity opacity-0 pointer-events-none dark:text-white -top-7 w-max group-hover:opacity-100">
  //               {userRewards['FPbalance']} {rewards['FPtoken']?.name}
  //             </span>
  //           </div>
  //         )}

  //         {userRewards['SPbalance'] > 0 && (
  //           <div className="relative group">
  //             <img
  //               src={rewards['SPtoken']?.uri}
  //               alt=""
  //               className="w-[40px] h-[40px] cursor-pointer "
  //             />{' '}
  //             {/** left-0  */}
  //             <span className="absolute right-0 transition-opacity opacity-0 pointer-events-none dark:text-white -top-7 w-max group-hover:opacity-100">
  //               {userRewards['SPbalance']} {rewards['SPtoken']?.name}
  //             </span>
  //           </div>
  //         )}
  //       </div>
  //     )}
  //   </>
  // )
}

=======
}

UserRewards.propTypes = {
  address: PropTypes.string
}

>>>>>>> release
export default UserRewards
