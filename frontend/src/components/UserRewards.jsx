import { useFetch } from "../hooks";

function UserRewards({ address }) {
  const {
    data: rewards,
    loading: isRewardsLoading,
    error: rewardsError,
  } = useFetch("http://localhost:8080/api/v1/rewards/");

  const {
    data: userRewards,
    loading: isUserRewardsLoading,
    error: userRewardsError,
  } = useFetch(
    `http://localhost:8080/api/v1/rewards/profiles/${address}/`,
    {},
    [address]
  );

  return (
    <>
      {userRewards && rewards && (
        <div className="flex">
          {userRewards["FPbalance"] > 0 && (
            <div className="group relative ">
              <img
                src={rewards["FPtoken"]?.uri}
                alt="FPtoken"
                className="w-[30px] h-[35px] ml-1 cursor-pointer"
              />
              <span className="pointer-events-none  text-white absolute -top-7 right-0 w-max opacity-0 transition-opacity group-hover:opacity-100">
                {userRewards["FPbalance"]} {rewards["FPtoken"]?.name}
              </span>
            </div>
          )}

          {userRewards["SPbalance"] > 0 && (
            <div className="group relative">
              <img
                src={rewards["SPtoken"]?.uri}
                alt=""
                className="w-[40px] h-[40px] cursor-pointer "
              />                                                            {/** left-0  */}
              <span className="pointer-events-none text-white absolute -top-7 right-0 w-max opacity-0 transition-opacity group-hover:opacity-100">
                {userRewards["SPbalance"]} {rewards["SPtoken"]?.name}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default UserRewards;
