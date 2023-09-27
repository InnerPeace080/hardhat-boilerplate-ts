/* eslint-disable no-console */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import hre, { ethers } from 'hardhat';
import utils from '../utils';

async function main() {
  var { SMART_CONTRACT_NAME, CONSTRUCTOR_ARGUMENTS } = utils.processSmartContractConfig(
    hre.userConfig.smartContractConfig,
    hre
  );
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! DEPLOY PROXY !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log(`SMART_CONTRACT_NAME=${SMART_CONTRACT_NAME}`);
  console.log(`Current NETWORK=${hre.network.name}`);
  const constructorArguments = CONSTRUCTOR_ARGUMENTS || [];

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', ethers.utils.formatEther(await deployer.getBalance()));

  // // If this script is run directly using `node` you may want to call compile
  // // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Contract = await hre.ethers.getContractFactory(SMART_CONTRACT_NAME);

  //
  await utils.confirm('Do you want to deploy PROXY ?');
  console.log('constructorArguments', constructorArguments);
  await utils.confirm('Are you sure want to deploy PROXY ?');
  //

  const contract = await hre.upgrades.deployProxy(Contract, constructorArguments, {
    kind: 'uups',
    unsafeAllow: ['constructor', 'delegatecall'],
  });

  console.log('Contract deploy transaction:', contract.deployTransaction.hash);
  console.log('Contract deploy to:', contract.address);

  utils.writeDeployInfo({
    SMART_CONTRACT_NAME,
    NODE_ENV: process.env.NODE_ENV,
    networkName: hre.network.name,
    transaction: contract.deployTransaction.hash,
    type: 'DEPLOY',
    proxyAddress: contract.address,
  });

  await contract.deployed();
  console.log('Contract deployed to:', contract.address);

  const implementationAddress = await hre.upgrades.erc1967.getImplementationAddress(contract.address);
  console.log('Implementation deployed to:', implementationAddress);

  utils.writeDeployInfo({
    SMART_CONTRACT_NAME,
    NODE_ENV: process.env.NODE_ENV,
    networkName: hre.network.name,
    transaction: contract.deployTransaction.hash,
    type: 'DEPLOY',
    proxyAddress: contract.address,
    implementationAddress,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
