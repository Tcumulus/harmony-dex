// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract LP is ERC20 {
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

  function addLiquidity (uint _amountTokenA, uint _amountTokenB) external {
    require(_amountTokenA > 0, "Amount tokenA invalid");
    require(_amountTokenB > 0, "Amount tokenB invalid");

    uint _totalSupply = this.totalSupply();
    if (_totalSupply > 0) { //check ratio tokenA and tokenB is right
      require(_amountTokenB == lockedTokenB * _amountTokenA / lockedTokenA, "amountTokenB invalid"); 
    }

    ERC20 tokenA = ERC20(addressTokenA);
    ERC20 tokenB = ERC20(addressTokenB);
    require(tokenA.transferFrom(msg.sender, address(this), _amountTokenA), "transfer tokenA failed"); //approval
    require(tokenB.transferFrom(msg.sender, address(this), _amountTokenB), "transfer tokenB failed"); //approval

    lockedTokenA = lockedTokenA + _amountTokenA;
    lockedTokenB = lockedTokenB + _amountTokenB;

    //calculate LPT amount
    uint liquidity;
    if (_totalSupply > 0) {
      liquidity = Math.min(_amountTokenA * _totalSupply / lockedTokenA, _amountTokenB * _totalSupply / lockedTokenB);
    } else {
      liquidity = sqrt(_amountTokenA * _amountTokenB);
    }
    _mint(msg.sender, liquidity);
  }

  function removeLiquidity (address account, uint _amountLPT) external {
    require(_amountLPT > 0, "Amount tokenA invalid");
    require(_amountLPT <= this.balanceOf(account));

    uint _totalSupply = this.totalSupply();
    uint256 _amountTokenA = (lockedTokenA * _amountLPT) / _totalSupply;
    uint256 _amountTokenB = (lockedTokenB * _amountLPT) / _totalSupply;

    ERC20 tokenA = ERC20(addressTokenA);
    ERC20 tokenB = ERC20(addressTokenB);
    require(tokenA.transfer(account, _amountTokenA), "transfer tokenA failed");
    require(tokenB.transfer(account, _amountTokenB), "transfer tokenB failed");

    lockedTokenA = lockedTokenA - _amountTokenA;
    lockedTokenB = lockedTokenB - _amountTokenB;

    _burn(account, _amountLPT); //approval
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