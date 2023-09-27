/* eslint-disable no-unused-expressions,no-magic-numbers,no-console,no-unused-vars */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import hre, { ethers, upgrades } from 'hardhat';

import utils from '../utils';
import { deployProxy, getContractFactory, upgradeProxy } from './helpers';

describe('Test Upgradeable function', function () {
  var owner: SignerWithAddress, wallets: SignerWithAddress[];

  const configs = utils.processSmartContractConfig(hre.userConfig.smartContractConfig, hre);
  // !!! NOTE: this override config for test example. You must remove if want to copy this code for other test
  configs.SMART_CONTRACT_NAME = 'GreeterUpgradeable';
  configs.CONSTRUCTOR_ARGUMENTS = ['Hello, world!'];

  beforeEach(async function () {
    [owner, ...wallets] = await ethers.getSigners();
    // deploy contract
    this.contract = await deployProxy(configs.SMART_CONTRACT_NAME, configs.CONSTRUCTOR_ARGUMENTS);
  });

  context('check init correct', function () {
    it('can not recall initialize ', async function () {
      await expect(this.contract.connect(wallets[0]).initialize(...configs.CONSTRUCTOR_ARGUMENTS)).to.be.revertedWith(
        'Initializable: contract is already initialized'
      );

      // check implementationContract
      let factory = await getContractFactory(configs.SMART_CONTRACT_NAME);
      const implementationAddress = await upgrades.erc1967.getImplementationAddress(this.contract.address);
      const implementationContract = factory.attach(implementationAddress);
      await expect(
        implementationContract.connect(wallets[0]).initialize(...configs.CONSTRUCTOR_ARGUMENTS)
      ).to.be.revertedWith('Initializable: contract is already initialized');
    });
    it('correct owner', async function () {
      expect(await this.contract.owner()).to.be.equal(owner.address);
    });
  });

  context('check upgrade', function () {
    it('can upgrade', async function () {
      const newContract = await upgradeProxy(this.contract.address, 'GreaterUpgradeV2Mock');
      expect(await newContract.VERSION()).to.be.equal('1.0.0-t');
    });
    it('not owner can not upgrade', async function () {
      await expect(upgradeProxy(this.contract.address, 'GreaterUpgradeV2Mock', wallets[0])).to.be.reverted;
    });
  });
});
