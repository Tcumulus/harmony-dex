// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract LP is ERC20 {
  event liquidityAdded(address indexed _account, uint indexed _amountTokenA, uint indexed _amountTokenB);

  //public variables
  address public addressTokenA;
  address public addressTokenB;
  uint public lockedTokenA = 0;
  uint public lockedTokenB = 0;

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
  function addLiquidity (uint _amountTokenA, uint _amountTokenB) external {
    require(_amountTokenA > 0, "Amount tokenA invalid");
    require(_amountTokenB > 0, "Amount tokenB invalid");

    uint _totalSupply = this.totalSupply();
    if (_totalSupply > 0) { //check ratio tokenA and tokenB is right
      require(_amountTokenB == lockedTokenB * _amountTokenA / lockedTokenA, "amountTokenB invalid"); //BUG
    }

    ERC20 tokenA = ERC20(addressTokenA);
    ERC20 tokenB = ERC20(addressTokenB);
    require(tokenA.transferFrom(msg.sender, address(this), _amountTokenA), "transfer tokenA failed");
    require(tokenB.transferFrom(msg.sender, address(this), _amountTokenB), "transfer tokenB failed");

    lockedTokenA = lockedTokenA + _amountTokenA;
    lockedTokenB = lockedTokenB + _amountTokenB;

    //calculate LPT amount
    uint liquidity;
    if (_totalSupply > 0) {
      liquidity = Math.min(_amountTokenA * _totalSupply / lockedTokenA, _amountTokenB * _totalSupply / lockedTokenB);
    } else {
      liquidity = sqrt(_amountTokenA * _amountTokenB);
    }
    //mint LPT
    _mint(msg.sender, liquidity);
    emit liquidityAdded(msg.sender, _amountTokenA, _amountTokenB);
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