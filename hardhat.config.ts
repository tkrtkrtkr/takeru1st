import * as dotenv from 'dotenv'
dotenv.config()

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "hardhat-gas-reporter"


const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: "https://eth.ymsg.space/v1/sepolia",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : undefined
    }
  }
};

export default config;
