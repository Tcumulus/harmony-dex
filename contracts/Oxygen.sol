// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Oxygen is ERC20 {
    constructor() ERC20("Oxygen", "OXY") {
      _mint(msg.sender, 100000 * (10 ** uint256(decimals())));
  }
}