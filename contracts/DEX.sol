// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./LP.sol";

contract DEX {
  mapping(address => mapping(address => address)) public getPairs;
  address[] public pairs;

  function addLP (string memory _name, string memory _symbol, address _tokenA, address _tokenB) external returns (address) {
    require(_tokenA != _tokenB, "invalid token pair");
    require(_tokenA != address(0), "tokenA address invalid");
    require(_tokenB != address(0), "tokenB address invalid");
    require(getPairs[_tokenA][_tokenB] == address(0), "pair already exists");
    require(getPairs[_tokenB][_tokenA] == address(0), "pair already exists");

    address liquidityPool = address(new LP(_name, _symbol, _tokenA, _tokenB));
    getPairs[_tokenA][_tokenB] = liquidityPool;
    getPairs[_tokenB][_tokenA] = liquidityPool;
    pairs.push(liquidityPool);

    return liquidityPool;
  }
}