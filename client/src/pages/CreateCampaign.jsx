import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {ethers} from 'ethers';
import {createCampaign, money} from '../assets';
import { CustomButton ,Loader} from '../components';
import { useStateContext } from '../context';
import {FormField} from '../components';
import {checkIfImage} from '../utils';
import axios from 'axios';

const CreateCampaign = () => {

  const navigate=useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {createCampaign,fetchData,query,query1} =useStateContext();
  const [form, setForm] = useState({
    name:'',
    title:'',
    description:'',
    target:'',
    deadline:'',
    image:''
  });

  const handleFormFieldChange=(fieldName,e)=>{
    setForm({ ...form,[fieldName]: e.target.value})
  }

  const handleSubmit= async (e)=>{
    e.preventDefault();
    // console.log(form);
    checkIfImage(form.image,async(exists)=>{
      if(exists){
        
        //this part is working with python flask backend;
        // try{
        //   const response = await axios.post('http://127.0.0.1:5000/detect', {
        //     campaignDescription: form.description
        //   }); 

        //   if(response['data']=='Yes'){
            
        //     console.log("hate speech detected!!");
        //   }
        //   else{
        //     console.log(response['data']);
        //     console.log("No hate speech detected");
        //   }
        // }
        // catch(error){
        //   console.log(`Error faced in detection ${error}`);
        // }


        // query1({"inputs": form.title}).then((response) => {
        //   console.log(JSON.stringify(response));
        // });

        
        await query1({"inputs": form.description}).then(async (response) => {
          console.log(response[0][0]);
          if(response[0]['0']['label']==='HATE'){

            alert("The description that you have added is offensive...you cannot proceed");
            navigate('/');
            
          }
          else{ 
                // console.log(`ye dikhra kya ${parseFloat(response[0]['1']['score'])}`);
                if(parseFloat(response[0]['1']['score'])>=0.2){
                  alert("The description that you have added is offensive...you cannot proceed");
                  navigate('/');
                  
                }else{
                  setIsLoading(true);
                  await createCampaign({...form, target:ethers.utils.parseUnits(form.target,18)});
                  setIsLoading(false);
                  navigate('/');
                }
          }
          
          
          
          // if(response[0][1]['label']==='NOT'){
          //   console.log(`This is Not offensive at all ${response[0][1]['score']}`);
          // }
          // else{
          //   console.log(`This is Offensive ${response[0][1]['score']}`);
          // }
        });

        
        
      }
      else{
        alert('Provide Valid Image URL')
        setForm({...form,image:''});
      }

    })
    //this was conversion of ether to wei

    

  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader/>}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>

      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px] ">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e)=>handleFormFieldChange('name',e)}
          />
          <FormField 
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e)=>handleFormFieldChange('title',e)}
          />

        </div>
        <FormField 
            labelName="Story *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e)=>handleFormFieldChange('description',e)}
          />
          <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-full">
            <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
            <h1 className="text-white font-epilogue font-bold text-[25px] ml-[20px]">You will get 100% of the raised amount</h1>

          </div>
          <div className="flex flex-wrap gap-[40px]">
            <FormField 
              labelName="Goal *"
              placeholder="ETH 0.50"
              inputType="text"
              value={form.target}
              handleChange={(e)=>handleFormFieldChange('target',e)}
            />
            <FormField 
              labelName="End Date *"
              placeholder="End Date"
              inputType="date"
              value={form.deadline}
              handleChange={(e)=>handleFormFieldChange('deadline',e)}
            />
            <FormField 
              labelName="Campaign Image *"
              placeholder="Place image url of your campaign"
              inputType="url"
              value={form.image}
              handleChange={(e)=>handleFormFieldChange('image',e)}
            />
            </div>

            <div className="flex justify-center items-center mt-[40px]">
              <CustomButton
                btnType="submit"
                title="submit new campaign"
                styles="bg-[#1dc071]"
              />

            </div>

          
      </form>
    </div>
  )
}

export default CreateCampaign