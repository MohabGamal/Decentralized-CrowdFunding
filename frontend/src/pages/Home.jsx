import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';
import useFetch from './../hooks/useFetch';

const Home = () => {
  const {
    data: campaigns,
    loading: isCampaignsLoading,
    error: campaignsError,
  } = useFetch(`http://localhost:8080/api/v1/campaigns?limit=${2}`);
  
  return (
    <DisplayCampaigns
      title='All Campaigns'
      isLoading={isCampaignsLoading}
      campaigns={campaigns}
    />
  );
};

export default Home;
