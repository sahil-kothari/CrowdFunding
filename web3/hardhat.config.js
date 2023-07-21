require("@matterlabs/hardhat-zksync-solc");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    // compilerSource: "binary",
    networks:{
      hardhat:{},
      mumbai:{
        url:process.env.url,
        accounts:[process.env.private_key]
      }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs:200,
      },
    },
  },
  

  
};
