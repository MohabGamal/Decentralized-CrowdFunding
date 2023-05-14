import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Web3Storage } from 'web3.storage';
import axios from 'axios';

import { useStateContext } from '../context';
// import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    title: '',
    category: '',
    description: '',
    message: '',
    target: '',
    deadline: '',
    image: {},
  });
  const { mainContract, signer ,address, connect } = useStateContext();


  const handleFormFieldChange = (fieldName, e) => {
    // setForm({ ...form, [fieldName]: e.target.value,  })
    if (fieldName === 'image') {
      setForm({ ...form, ['image']: e.target.files });
    } else {
      setForm({ ...form, [fieldName]: e.target.value });
    }
  };


  const uploadToIpfs = async (image) => {
    try {
      const client = new Web3Storage({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY4YTcwOGY0NTI5MTdlZGMwNDU2N0Q2MzlDZjlmMEYxMTlFYjAwOTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzkxNjUxNjQ0NDMsIm5hbWUiOiJDcm93ZEZ1bmRpbmcifQ.iUossDvt3UX5-QCoZHG5wqCBzUaoRauFFNx4FfNnwwk',
      });
      const cid = await client.put(image);
      // const imgUrl = `https://dweb.link/ipfs/${cid}`;
      console.log('image cid', cid);
      return cid;
    } catch (error) {
      console.log('No image selected', error);
    }
  };

  const createCampaign = async (
    target,
    title,
    desc,
    category,
    message,
    image
  ) => {
    try {
      const cid = await uploadToIpfs(image);
      const encodedImageName = encodeURIComponent(image[0].name);
      const imageUrl = `http://${cid}.ipfs.dweb.link/${encodedImageName}`;

      const tx = await mainContract
        .connect(signer)
        .createCampaign(target, title, imageUrl);
      const receipt = await tx.wait();

      const startedEvent = receipt.events.find(
        (event) => event.event === 'Started'
      );
      const campaignId = Number(startedEvent.args.campaignId);

      await axios.post(`http://localhost:8080/api/v1/campaigns/`, {
        campaignId,
        desc,
        category,
        message,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await createCampaign(
      form.target,
      form.title,
      form.description,
      form.category,
      form.message,
      form.image
    );

    if (success) {
      toast.success('Campaign Created!');
      navigate('/');
    } else {
      toast.error('Campaign Creation Failed!');
    }
    setIsLoading(false);

    // checkIfImage(form.image, async (exists) => {
    //   if(exists) {
    //     setIsLoading(true)
    //     // await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18)})
    //     await createCampaign(form)
    //     setIsLoading(false);
    //     navigate('/');
    //   } else {
    //     alert('Provide valid image URL')
    //     setForm({ ...form, image: '' });
    //   }
    // })
  };


  return (
    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
      {isLoading && <Loader />}
      <div className='flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]'>
        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'>
          Start a Campaign
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className='w-full mt-[65px] flex flex-col gap-[30px]'>
        <div className='flex flex-wrap gap-[40px]'>
          {/* <FormField 
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          /> */}
          <FormField
            labelName='Campaign Title *'
            placeholder='Write a title'
            inputType='text'
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
          <FormField
            labelName='Campaign Category *'
            placeholder='Write one'
            inputType='text'
            value={form.category}
            handleChange={(e) => handleFormFieldChange('category', e)}
          />
        </div>

        <FormField
          labelName='Story *'
          placeholder='Write your story'
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />
        <FormField
          labelName='Short Message'
          placeholder='please...'
          isNotRequired
          inputType='text'
          value={form.message}
          handleChange={(e) => handleFormFieldChange('message', e)}
        />
        {/* <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div> */}

        <div className='flex flex-wrap gap-[40px]'>
          <FormField
            labelName='Goal *'
            placeholder='ETH 0.50'
            inputType='text'
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          {/* <FormField 
            labelName="Message *"
            placeholder="please..."
            inputType="text"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          /> */}
        </div>

        {/* <FormField 
            labelName="Campaign image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          /> */}

        <FormField
          labelName='Campaign image *'
          inputType='file'
          handleChange={(e) => handleFormFieldChange('image', e)}
        />

        <div className='flex justify-center items-center mt-[40px]'>
          {/* <CustomButton 
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
          /> */}
          {address ? (
            <CustomButton
              btnType='submit'
              title='Submit new campaign'
              styles='bg-[#1dc071]'
            />
          ) : (
            <CustomButton
              btnType='button'
              title='Connect'
              styles='w-full bg-[#8c6dfd]'
              handleClick={connect}
            />
          )}
          <button onClick={handleSubmit}></button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
