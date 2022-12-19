/* eslint-disable no-console */

import { task, types } from 'hardhat/config';
import utils from '../utils';

task('upgrade', 'Upgrade smartcontract on etherscan') //eslint-disable-line no-undef
  .addParam('address', "The proxy's address")
  .addOptionalParam('unsafeSkipStorageCheck', 'unsafeSkipStorageCheck', false, types.boolean)
  .setAction(async function (taskArguments, hre, runSuper) {
    const { SMART_CONTRACT_NAME } = utils.processSmartContractConfig(hre.userConfig.smartContractConfig, hre);
    const ethers = hre.ethers;
    console.log(`SMART_CONTRACT_NAME=${SMART_CONTRACT_NAME}`);
    console.log(`Current NETWORK=${hre.network.name}`);
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    const [deployer] = await ethers.getSigners();
    console.log('Upgrade contracts with the account:', deployer.address);
    console.log('Account balance:', ethers.utils.formatEther(await deployer.getBalance()));
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    await hre.run('compile');

    // We get the contract to upgrade
    const Contract = await hre.ethers.getContractFactory(SMART_CONTRACT_NAME);

    console.log('Proxy address:', taskArguments.address);
    //
    await utils.confirm('Do you want to upgrade?');

    console.log('Upgrading ...');
    const contract = await hre.upgrades.upgradeProxy(taskArguments.address, Contract, {
      unsafeSkipStorageCheck: !!taskArguments.unsafeSkipStorageCheck,
      unsafeAllow: ['constructor'],
    });

    console.log('Upgraded successfully to:', contract.address);

    utils.writeDeployInfo({
      SMART_CONTRACT_NAME,
      NODE_ENV: process.env.NODE_ENV,
      networkName: hre.network.name,
      transaction: contract.deployTransaction.hash,
      type: 'UPGRADE',
      safe: !taskArguments.unsafeSkipStorageCheck,
      proxyAddress: contract.address,
      implementationAddress: 'WAITING',
    });

    await contract.deployTransaction.wait();

    const implementationAddress = await hre.upgrades.erc1967.getImplementationAddress(contract.address);
    console.log('Implementation deployed to:', implementationAddress);

    utils.writeDeployInfo({
      SMART_CONTRACT_NAME,
      NODE_ENV: process.env.NODE_ENV,
      networkName: hre.network.name,
      transaction: contract.deployTransaction.hash,
      type: 'UPGRADE',
      safe: !taskArguments.unsafeSkipStorageCheck,
      proxyAddress: contract.address,
      implementationAddress,
    });
  });

module.exports = {};
