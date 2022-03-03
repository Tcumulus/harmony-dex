// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract LP is ERC20 {
  //public variables
  address public addressTokenA;
  address public addressTokenB;
  int public lockedTokenA = 0;
  int public lockedTokenB = 0;
  int public fee = 10000;

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

  function swap(address account, int _amountTokenA, int _amountTokenB) external {
    require(_amountTokenA < lockedTokenA, "amount TokenA too large");
    require(_amountTokenB < lockedTokenB, "amount TokenB too large");
    ERC20 tokenA = ERC20(addressTokenA);
    ERC20 tokenB = ERC20(addressTokenB);

    if (_amountTokenA == 0) {
      require(_amountTokenB > 0, "amount TokenB invalid");
      _amountTokenA = lockedTokenA - ((lockedTokenA * lockedTokenB) / (lockedTokenB + _amountTokenB));
      _amountTokenA = _amountTokenA - _amountTokenA / fee;
      require(tokenB.transferFrom(account, address(this), uint(_amountTokenB)), "transfer TokenB failed"); //approval
      require(tokenA.transfer(account, uint(abs(_amountTokenA))));

      lockedTokenA = lockedTokenA - _amountTokenA;
      lockedTokenB = lockedTokenB + _amountTokenB;
    } 
    else if (_amountTokenB == 0) {
      require(_amountTokenA > 0, "amount TokenA invalid");
      _amountTokenB = lockedTokenB - ((lockedTokenA * lockedTokenB) / (lockedTokenA + _amountTokenA));
      _amountTokenB = _amountTokenB - _amountTokenB / fee;
      require(tokenA.transferFrom(account, address(this), uint(_amountTokenA)), "transfer TokenA failed"); //approval
      require(tokenB.transfer(account, uint(abs(_amountTokenB))));

      lockedTokenA = lockedTokenA + _amountTokenA;
      lockedTokenB = lockedTokenB - _amountTokenB;
    } else {
      revert("amounts invalid");
    }

    //TODO distribute fees
  }

  function addLiquidity (int _amountTokenA, int _amountTokenB) external {
    require(_amountTokenA > 0, "Amount tokenA invalid");
    require(_amountTokenB > 0, "Amount tokenB invalid");

    uint _totalSupply = this.totalSupply();
    if (_totalSupply > 0) { //check ratio tokenA and tokenB is right
      require(_amountTokenB == lockedTokenB * _amountTokenA / lockedTokenA, "amountTokenB invalid"); 
    }

    ERC20 tokenA = ERC20(addressTokenA);
    ERC20 tokenB = ERC20(addressTokenB);
    require(tokenA.transferFrom(msg.sender, address(this), uint(_amountTokenA)), "transfer tokenA failed"); //approval
    require(tokenB.transferFrom(msg.sender, address(this), uint(_amountTokenB)), "transfer tokenB failed"); //approval

    lockedTokenA = lockedTokenA + _amountTokenA;
    lockedTokenB = lockedTokenB + _amountTokenB;

    //calculate LPT amount
    uint liquidity;
    if (_totalSupply > 0) {
      liquidity = Math.min(uint(_amountTokenA) * _totalSupply / uint(lockedTokenA), uint(_amountTokenB) * _totalSupply / uint(lockedTokenB));
    } else {
      liquidity = sqrt(uint(_amountTokenA) * uint(_amountTokenB));
    }
    _mint(msg.sender, liquidity);
  }

  function removeLiquidity (address account, int _amountLPT) external {
    require(_amountLPT > 0, "Amount tokenA invalid");
    require(_amountLPT <= int(this.balanceOf(account)));

    int _totalSupply = int(this.totalSupply());
    int256 _amountTokenA = (lockedTokenA * _amountLPT) / _totalSupply;
    int256 _amountTokenB = (lockedTokenB * _amountLPT) / _totalSupply;

    ERC20 tokenA = ERC20(addressTokenA);
    ERC20 tokenB = ERC20(addressTokenB);
    require(tokenA.transfer(account, uint(_amountTokenA)), "transfer tokenA failed");
    require(tokenB.transfer(account, uint(_amountTokenB)), "transfer tokenB failed");

    lockedTokenA = lockedTokenA - _amountTokenA;
    lockedTokenB = lockedTokenB - _amountTokenB;

    _burn(account, uint(_amountLPT)); //approval
  }

  function sqrt(uint x) private pure returns (uint y) {
    uint z = (x + 1) / 2;
    y = x;
    while (z < y) {
      y = z;
      z = (x / z + z) / 2;
    }
  }

  function abs(int x) private pure returns (int y) {
    return x >= 0 ? x : -x;
  }
}