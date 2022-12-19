require('dotenv').config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' });
console.log(`Current NODE_ENV=${process.env.NODE_ENV ? process.env.NODE_ENV : '!!!!!!MAIN!!!!!'}`);

import { HardhatUserConfig, task } from 'hardhat/config';

import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-gas-trackooor';
import 'hardhat-storage-layout';
import 'hardhat-tracer';
import './tasks/manual-verify';
import './tasks/prepare-upgrade';
import './tasks/upgrade';

const MILLISECOND_PER_SECOND = 1000;

const smartContractConfig = {
  SMART_CONTRACT_NAME: 'Greeter',
  MESSAGE: 'Hello, world!',
  goerli: {},
  CONSTRUCTOR_ARGUMENTS: ['MESSAGE'] as any[],
};

if (process.env.NODE_ENV === 'test') {
  Object.assign(smartContractConfig, {});
}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    smartContractConfig: typeof smartContractConfig;
  }
}

const config: HardhatUserConfig = {
  smartContractConfig,
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      outputSelection: {
        '*': {
          '*': ['storageLayout'],
        },
      },
    },
  },
  networks: {
    main: {
      url: process.env.API_URL_MAIN || '',
      accounts: process.env.PRIVATE_KEY_MAIN ? [process.env.PRIVATE_KEY_MAIN] : [],
      gasMultiplier: 1.1,
    },
    hardhat: {},
    ganache: {
      url: 'http://localhost:7545',
      accounts: { mnemonic: 'metal large diary vacuum surround spread devote patient artefact stomach spot empower' },
      gasMultiplier: 1.1,
    },
    goerli: {
      url: process.env.API_URL_GOERLI,
      accounts: [process.env.PRIVATE_KEY_TEST || ''],
      gasMultiplier: 1.1,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'TRUE',
    currency: 'USD',
    coinmarketcap: process.env.COIN_MARKET_CAP_KEY || undefined,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
