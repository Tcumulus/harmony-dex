// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Natrium is ERC20 {
    constructor() ERC20("Natrium", "NAT") {
      _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
  }
}