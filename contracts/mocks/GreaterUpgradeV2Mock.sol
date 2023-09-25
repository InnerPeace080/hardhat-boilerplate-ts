//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract GreaterUpgradeV2Mock is Initializable, UUPSUpgradeable, OwnableUpgradeable {
  string public constant VERSION = "1.0.0-t";

  string private greeting;

  constructor() {
    initialize("");
  }

  /// @dev initialize the contract
  function initialize(string memory _greeting) public initializer {
    __Ownable_init();
    greeting = _greeting;
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

  function greet() public view returns (string memory) {
    return greeting;
  }

  function setGreeting(string memory _greeting) public {
    greeting = _greeting;
  }
}
