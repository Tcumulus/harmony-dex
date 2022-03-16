import React, { useState, useContext, useEffect } from "react"
import { ethers } from "ethers"
import { Context } from "./App"

const Token = ({ token, roundBalance, setToken, setChoose, getBalance }) => {
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
  const { signer, address, balance } = useContext(Context)
  const [tokenBalance, setTokenBalance] = useState("-")

  useEffect(async () => {
    if(signer) {
      const _balance = await getBalance(token)
      setTokenBalance(_balance)
    }
  }, [signer])

  const addToken = async (event) =>{
    event.stopPropagation()
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

  const onSelectToken = () => {
    setToken(token)
    setChoose(false)
  }
  
  return(
    <div onClick={onSelectToken} className="flex flex-grow justify-between items-center h-16 hover:bg-gray-200 cursor-pointer">
      <div className="ml-6 flex flex-col">
        <div className="flex">
          <p className="text-lg font-semibold text-gray-600">{symbol}</p>
          {token.symbol !== "ONE" ? <button onClick={addToken} 
            className="ml-4 w-6 h-6 text-sm text-gray-400 border border-gray-400 rounded-full hover:bg-gray-500 hover:text-[#f7f7f7] hover:border-gray-500"
          >+</button> :null}
        </div>
        <p className="text-sm text-gray-600">{name}</p>
      </div>
      <div className="flex flex-grow justify-end mr-4">
        <p className="text-sm text-gray-600">{tokenBalance == "-" ? tokenBalance : roundBalance(tokenBalance, "")}</p>
      </div>
    </div>
  )
}

export default Token