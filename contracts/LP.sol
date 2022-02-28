// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract LP is ERC20 {
  event liquidityAdded(address indexed _account);

  //public variables
  address public addressTokenA;
  address public addressTokenB;
  uint public lockedTokenA;
  uint public lockedTokenB;

  //initiating new ERC20 token: liquidity token
  constructor (
    string memory _name, 
    string memory _symbol, 
    address _addressTokenA, 
    address _addressTokenB
  ) ERC20(_name, _symbol) {
    addressTokenA = _addressTokenA;
    addressTokenB = _addressTokenB;
  }

  //add liquidity, without affecting current price
  function addLiquidity (uint _amountTokenA) external {
    ERC20 tokenA = ERC20(addressTokenA);
    require(tokenA.transferFrom(msg.sender, address(this), _amountTokenA), "transfer tokenA failed");
    ERC20 tokenB = ERC20(addressTokenB);
    uint _amountTokenB = lockedTokenB / lockedTokenA * _amountTokenA;
    require(tokenB.transferFrom(msg.sender, address(this), _amountTokenB), "transfer tokenB failed");

    //calculate LPT amount
    uint liquidity;
    uint _totalSupply = this.totalSupply();
    if (_totalSupply > 0) {
      liquidity = Math.min(_amountTokenA * _totalSupply / lockedTokenA, _amountTokenB * _totalSupply / lockedTokenB);
    } else {
      liquidity = sqrt(_amountTokenA * _amountTokenB);
    }
    //mint LPT
    _mint(msg.sender, liquidity);
    emit liquidityAdded(msg.sender);
  }

  function sqrt(uint x) private pure returns (uint y) {
    uint z = (x + 1) / 2;
    y = x;
    while (z < y) {
      y = z;
      z = (x / z + z) / 2;
    }
}
}