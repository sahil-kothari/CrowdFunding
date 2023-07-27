import React, { useContext, createContext } from 'react';
import axios from 'axios';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // const { contract } = useContract('0x31E5E01556d4f42602dBEBc261533374aE76d127');
  const {contract} =useContract('0xBc49A9E295d2713F6D37a194aB05626cf09930ed');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
				args: [
					address, // owner
					form.title, // title
					form.description, // description
					form.target,
					new Date(form.deadline).getTime(), // deadline,
					form.image,
				],
			});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }

  

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donationToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }


    const API_KEY="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";
    const fetchData = async (input) => {
        const response = await axios.post(
          "https://api.openai.com/v1/completions",
          {
            prompt: `Rephrase this sentence: "${input}"`,
            model: 'text-davinci-003',
            max_tokens: 50,
            n: 1,
            stop: ".",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
      
        return response.data.choices[0].text;
      };

      const query=async(data)=> {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/christinacdl/BERT_Offensive_English_Twitter",
          {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        return result;
      }
      // Hate-speech-CNERG/dehatebert-mono-english
      const query1=async(data)=> {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/Hate-speech-CNERG/dehatebert-mono-english",
          {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        return result;
      }
      
      // query({"inputs": "I like you. I love you"}).then((response) => {
      //   console.log(JSON.stringify(response));
      // });


      // query({"inputs": "I like you. I love you"}).then((response) => {
      //   console.log(JSON.stringify(response));
      // });


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        fetchData,
        query,
        query1
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);

