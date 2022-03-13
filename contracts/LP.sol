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
  uint16 public fee = 3333; //(1/3333) = 0.0003 = 0.3%
  uint public totalFees = 0;

  //liquidity provider balances
  mapping(address => uint) balances;
  mapping(address => uint) fees;

  //events
  event _addLiquidity(address indexed account, uint amountA, uint amountB);
  event _removeLiquidity(address indexed account, uint amountA, uint amountB);
  event _swap(address indexed account, address indexed base, uint amountA, uint amountB, uint feeLPT);

  //initializing new ERC20 token: liquidity token
  constructor (
    string memory _name,
    string memory _symbol, 
    address _addressTokenA, 
    address _addressTokenB
  ) ERC20(_name, _symbol) {
    addressTokenA = _addressTokenA;
    addressTokenB = _addressTokenB;
  }

  function swap(address account, uint _amountTokenA, uint _amountTokenB) external {
    address base;
    uint liquidity;
    uint feeA;
    uint feeB;
    uint _totalSupply = this.totalSupply();
    ERC20 tokenA = ERC20(addressTokenA);
    ERC20 tokenB = ERC20(addressTokenB);

    //B -> A
    if (_amountTokenA == 0) {
      require(_amountTokenB > 0, "amount TokenB invalid");
      base = addressTokenB;

      feeB = _amountTokenB / (fee * 2); //subtracting half of the fee of the B amount
      _amountTokenA = lockedTokenA - ((lockedTokenA * lockedTokenB) / (lockedTokenB + (_amountTokenB - feeB))); //calculate A for amount B with fees subtracted
      
      feeA = lockedTokenA * feeB / lockedTokenB; //lockedTokenA / lockedTokenB = feeA / feeB
      _amountTokenA -= feeA;

      require(tokenB.transferFrom(account, address(this), _amountTokenB), "transfer TokenB failed"); //approval
      require(tokenA.transfer(account, _amountTokenA));

      lockedTokenA -= _amountTokenA;
      lockedTokenB += _amountTokenB;
    }

    //A -> B
    else if (_amountTokenB == 0) {
      require(_amountTokenA > 0, "amount TokenA invalid");
      base = addressTokenA;

      feeA = _amountTokenA / (fee * 2);
      _amountTokenB = lockedTokenB - ((lockedTokenA * lockedTokenB) / (lockedTokenA + (_amountTokenA - feeA)));

      feeB = lockedTokenA * feeA / lockedTokenB;
      _amountTokenB -= feeB;

      require(tokenA.transferFrom(account, address(this), _amountTokenA), "transfer TokenA failed"); //approval
      require(tokenB.transfer(account, _amountTokenB));

      lockedTokenA += _amountTokenA;
      lockedTokenB -= _amountTokenB;
    } else {
      revert("amounts invalid");
    }

    liquidity = Math.min(feeA * _totalSupply / lockedTokenA, feeB * _totalSupply / lockedTokenB);
    totalFees += liquidity;
    emit _swap(account, base, _amountTokenA, _amountTokenB, liquidity);
  }

  function addLiquidity (address account, uint _amountTokenA, uint _amountTokenB) external {
    require(_amountTokenA > 0, "Amount tokenA invalid");
    require(_amountTokenB > 0, "Amount tokenB invalid");

    uint _totalSupply = this.totalSupply();
    if (_totalSupply > 0) { //check ratio tokenA and tokenB is right
      require(_amountTokenB == lockedTokenB * _amountTokenA / lockedTokenA, "amountTokenB invalid"); 
    }

    ERC20 tokenA = ERC20(addressTokenA);
    ERC20 tokenB = ERC20(addressTokenB);
    require(tokenA.transferFrom(account, address(this), _amountTokenA), "transfer tokenA failed"); //approval
    require(tokenB.transferFrom(account, address(this), _amountTokenB), "transfer tokenB failed"); //approval

    lockedTokenA += _amountTokenA;
    lockedTokenB += _amountTokenB;

    //calculate LPT amount
    uint liquidity;
    if (_totalSupply > 0) {
      liquidity = Math.min(_amountTokenA * _totalSupply / lockedTokenA, _amountTokenB * _totalSupply / lockedTokenB);
    } else {
      liquidity = sqrt(_amountTokenA * _amountTokenB);
    }

    //mint LPT
    _mint(account, liquidity);
    if (balances[account] > 0) {
      _update(account);
      balances[account] += liquidity;
    } else {
      balances[account] = liquidity;
      fees[account] = totalFees;
    }
    emit _addLiquidity(account, _amountTokenA, _amountTokenB);
  }

  function removeLiquidity (address account, uint liquidity) external {
    _update(account);
    require(liquidity > 0, "Amount invalid");
    require(liquidity <= balances[account], "Amount invalid");

    uint _totalSupply = this.totalSupply();
    uint _amountTokenA = (lockedTokenA * liquidity) / _totalSupply;
    uint _amountTokenB = (lockedTokenB * liquidity) / _totalSupply;

    ERC20 tokenA = ERC20(addressTokenA);
    ERC20 tokenB = ERC20(addressTokenB);
    require(tokenA.transfer(account, _amountTokenA), "transfer tokenA failed");
    require(tokenB.transfer(account, _amountTokenB), "transfer tokenB failed");

    lockedTokenA -= _amountTokenA;
    lockedTokenB -= _amountTokenB;

    _burn(account, liquidity); //approval
    balances[account] -= liquidity;
    emit _removeLiquidity(account, _amountTokenA, _amountTokenB);
  }

  function _update (address account) public {
    uint owedAmount = (totalFees - fees[account]) * balances[account] / this.totalSupply();
    if (owedAmount != 0) {
      _mint(account, owedAmount);
      balances[account] += owedAmount;
      fees[account] = totalFees;
    }
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