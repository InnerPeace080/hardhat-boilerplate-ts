/* eslint-disable no-console */
import { task, types } from 'hardhat/config';
import utils from '../utils';

task('manual-verify', 'Verify smartcontract on etherscan') //eslint-disable-line no-undef
  .addParam('address', "The smartcontract's address")
  .addOptionalParam('noArguments', 'noArguments', false, types.boolean)
  .setAction(async function (taskArguments, hre, runSuper) {
    const { CONSTRUCTOR_ARGUMENTS } = utils.processSmartContractConfig(hre.userConfig.smartContractConfig, hre);
    // const ethers = hre.ethers;
    console.log(`Current NETWORK=${hre.network.name}`);
    console.log('Verify');
    console.log('Smartcontract address:', taskArguments.address);
    await hre.run('verify:verify', {
      address: taskArguments.address,
      constructorArguments: taskArguments.noArguments ? [] : CONSTRUCTOR_ARGUMENTS || [],
    });
  });
