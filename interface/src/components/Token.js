import React, { useState, useContext } from "react"
import { ethers } from "ethers"
import { Context } from "./App"

const Token = ({ token, roundBalance }) => {
  const ABI = [
    {
      "constant":true,
      "inputs":[{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "type":"function"
    }
  ]

  const { tokenAddress, symbol, decimals, name } = token
  const { signer, address } = useContext(Context)
  const [balance, setBalance] = useState("-")
 
  const getBalance = async () => {
    if (signer) {
      const tokenContract = new ethers.Contract(tokenAddress, ABI, signer)
      let _balance = await tokenContract.balanceOf(address)
      _balance = Number(ethers.utils.formatUnits(_balance, 18))
      _balance = roundBalance(_balance, "")
      setBalance(_balance)
    }
  }
  getBalance()

  const addToken = async () =>{
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: symbol,
          decimals: decimals,
        },
      },
    });
  }
  
  return(
    <div className="flex flex-grow justify-between items-center h-16 hover:bg-gray-200">
      <div className="ml-6 flex flex-col">
        <div className="flex">
          <p className="text-lg font-semibold text-gray-600">{symbol}</p>
          <button onClick={addToken} className="ml-4 text-lg text-gray-400">+</button>
        </div>
        <p className="text-sm text-gray-600">{name}</p>
      </div>
      <div className="flex flex-grow justify-end mr-4">
        <p className="text-sm text-gray-600">{balance}</p>
      </div>
    </div>
  )
}

export default Token