import React, { useContext, createContext, useState } from 'react';
import {
  contractAddress,
  rewardContractAddress,
  mainContractAbi,
  rewardContractAbi,
} from '../constants/index';
import { ethers } from 'ethers';


const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState();

  function connect() { 
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setAddress(accounts[0]);
        })
        .catch(console.error);
    } else {
      // Handle the case where the user doesn't have MetaMask installed
      console.error('Please install MetaMask!');
      window.open('https://metamask.io/download/', '_blank'); // open in a new tab
    }
  }

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    signer
      .getAddress()
      .then((result) => setAddress(result))
      .catch(() => console.log);

    window.ethereum.on('accountsChanged', (accounts) => {
      setAddress(accounts[0])
    });

    const mainContract = new ethers.Contract(
      contractAddress,
      mainContractAbi,
      provider
    );
    // const rewardContract = new ethers.Contract(
    //   rewardContractAddress,
    //   rewardContractAbi,
    //   provider
    // );

    // const createCampaign = async (
    //   target,
    //   title,
    //   desc,
    //   category,
    //   message,
    //   image
    // ) => {
    //   try {
    //     const cid = await uploadToIpfs(image);
    //     const encodedImageName = encodeURIComponent(image[0].name);
    //     const imageUrl = `http://${cid}.ipfs.dweb.link/${encodedImageName}`;

    //     const tx = await mainContract
    //       .connect(signer)
    //       .createCampaign(target, title, imageUrl);
    //     const receipt = await tx.wait();

    //     const startedEvent = receipt.events.find(
    //       (event) => event.event === 'Started'
    //     );
    //     const campaignId = Number(startedEvent.args.campaignId);

    //     await axios.post(`http://localhost:8080/api/v1/campaigns/`, {
    //       campaignId,
    //       desc,
    //       category,
    //       message,
    //     });

    //     return true;
    //   } catch (error) {
    //     console.error(error);
    //     return false;
    //   }
    // };

    // const donate = async (pId, amount) => {
    //   try {
    //     await mainContract
    //       .connect(signer)
    //       .fundCampaignWithEth(pId, { value: ethers.utils.parseEther(amount) });
    //     return true;
    //   } catch (error) {
    //     return false;
    //   }
    // };

    return (
      <>
        {/* {address &&  */}
        <StateContext.Provider
          value={{
            signer,
            address,
            mainContract,
            connect,
          }}>
          {children}
        </StateContext.Provider>
        {/* } */}
      </>
    );
  } else {
    return (
      <StateContext.Provider
        value={{
          signer: null,
          address: null,
          mainContract: null,
          connect,
        }}>
        {children}
      </StateContext.Provider>
    );
  }
};

export const useStateContext = () => useContext(StateContext);
