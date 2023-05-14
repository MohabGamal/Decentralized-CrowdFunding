import { useNavigate } from "react-router-dom";

import FundCard from "./FundCard";
import { loader } from "../assets";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    // navigate(`/campaign-details/${campaign.title}`, { state: campaign });
    navigate(`/campaign-details/${campaign.pId}`)
  };
  return (
    <div>
      <h2 className="font-epilogue font-semibold text-[20px] text-white text-left">
        {title} ({campaigns?.length})
      </h2>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaigns?.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No campigns to show
          </p>
        )}

        {!isLoading &&
          campaigns?.length > 0 &&
          campaigns.map((campaign) => 
            <FundCard
              key={campaign.pId}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          )}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
