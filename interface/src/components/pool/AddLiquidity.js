import React, { useState, useContext, useEffect } from "react"
import { ethers } from "ethers"
import arrowGray from "../../images/arrowGray.png"
import arrowWhite from "../../images/arrowWhite.png"
import cross from "../../images/cross.png"

import ChooseToken from "../general/ChooseToken"
import { Context } from "../App"
import { getBalanceABI } from "../../abis"

const AddLiquidity = ({ roundBalance, setAddLiquidity, chainId, connectWallet, addToFirebase }) => {
  const [amountA, setAmountA] = useState("")
  const [amountB, setAmountB] = useState("")
  const [chooseA, setChooseA] = useState(false)
  const [chooseB, setChooseB] = useState(false)

  const [tokenA, setTokenA] = useState({symbol: "ONE", name: "Harmony", tokenAddress: "", decimals: 18})
  const [tokenB, setTokenB] = useState(null)
  const [balanceA, setBalanceA] = useState(null)
  const [balanceB, setBalanceB] = useState(null)

  const [poolShare, setPoolShare] = useState(0.1)

  const [buttonText, setButtonText] = useState("Swap")
  const [buttonStyle, setButtonStyle] = useState("cursor-pointer bg-[#3dbcf2] hover:bg-[#1cabe8] text-[#f7f7f7]")
  const [available, setAvailable] = useState(0) //0: swap, 1: blocked, 2: connect wallet

  const { signer, address, balance } = useContext(Context)

  useEffect(() => {
    if (tokenA && signer) {
      getABBalance(tokenA, "A")
    } if (tokenB && signer) {
      getABBalance(tokenB, "B")
    }
  })

  useEffect(() => {
    if (tokenA && signer) {
      getABBalance(tokenA, "A")
    }
  }, [tokenA])

  useEffect(() => {
    if (tokenB && signer) {
      getABBalance(tokenB, "B")
    }
  }, [tokenB])

  useEffect(() => {
    check()
  }, [chainId, tokenA, amountA, balanceA, tokenB, amountB, balanceB])

  const onTokenAInputChange = (event) => {
    const val = event.target.value
    if (val >= 0) {
      setAmountA(val)
    }
  }

  const onTokenBInputChange = (event) => {
    const val = event.target.value
    if (val >= 0) {
      setAmountB(val)
    }
  }

  const getBalance = async (token) => {
    let _balance
    if (token.symbol == "ONE") {
      _balance = balance
    }
    else {
      const tokenContract = new ethers.Contract(token.tokenAddress, getBalanceABI, signer)
      _balance = await tokenContract.balanceOf(address)
      _balance = Number(ethers.utils.formatUnits(_balance, 18))
    }
    return _balance
  }

  const getABBalance = async (token, AB) => {
    const _balance = await getBalance(token)
    if (AB === "A") {
      setBalanceA(_balance)
    } else if (AB === "B") {
      setBalanceB(_balance)
    }
  }

  const check = () => {
    const grayed = "cursor-default bg-gray-200 text-gray-500"
    const normal = "cursor-pointer bg-[#3dbcf2] hover:bg-[#1cabe8] text-[#f7f7f7]"
    if (!window.ethereum) {
      setButtonStyle(grayed)
      setButtonText("Connect Metamask")
      setAvailable(1)
    } else if (!chainId) {
      setButtonStyle(normal)
      setButtonText("Connect Wallet")
      setAvailable(2) 
    } else if (chainId !== 1666700000) {
      setButtonStyle(grayed)
      setButtonText("Wrong network")
      setAvailable(1)
    } else if (!tokenA || !tokenB) {
      setButtonStyle(grayed)
      setButtonText("Select token")
      setAvailable(1)
    } else if (!amountA && amountA <= 0) {
      setButtonStyle(grayed)
      setButtonText("Enter amount")
      setAvailable(1)
    } else if (balanceA < amountA) {
      setButtonStyle(grayed)
      setButtonText("Insufficient " + tokenA.symbol + " balance")
      setAvailable(1)
    } else if (balanceB < amountB) {
      setButtonStyle(grayed)
      setButtonText("Insufficient " + tokenB.symbol + " balance")
      setAvailable(1)
    } else {
      setButtonStyle(normal)
      setButtonText("Add Liquidity")
      setAvailable(0)
    }
  }

  const ratioAB = () => {
    if(amountA && amountA > 0 && amountB && amountB > 0 && tokenA && tokenB) {
      return roundBalance(amountA/amountB, tokenA.symbol + "/" + tokenB.symbol)
    }
  }

  const ratioBA = () => {
    if(amountA && amountA > 0 && amountB && amountB > 0 && tokenA && tokenB) {
      return roundBalance(amountB/amountA, tokenB.symbol + "/" + tokenA.symbol)
    }
  }

  const onAddLiquidity = (event) => {
    event.preventDefault()

    // @smartcontracts
    // APPROVE
    // ADD LIQUIDITY
    // UPDATE

    addToFirebase(tokenA, tokenB, amountA, amountB)
    console.log("Added Liquidity")
  }

  const onConnectWallet = (event) => {
    event.preventDefault()
    connectWallet()
  }

  return(
    <div className="flex flex-col flex-grow items-center pt-6">
      <form 
        onSubmit={onTokenAInputChange} autoComplete="off" 
        className="flex flex-col items-center z-10 w-96 p-4 mt-10 bg-[#f7f7f7] rounded-2xl shadow-xl"
      >
        <div className="flex w-full items-center justify-between">
          <p className="font-semibold text-gray-600 pl-2 pt-1 pb-3">Add Liquidity</p>
          <img onClick={()=>setAddLiquidity(false)} src={cross}
               className="mr-4 mb-3 w-4 h-4 font-bold text-2xl text-gray-600 cursor-pointer"/>
        </div>

        <div className="flex-col flex-grow w-full justify-between items-center rounded-2xl border-2">
          <div className="flex flex-grow w-full justify-between">
            <p className="text-sm text-gray-600 ml-3 mt-2">From</p>
            {balanceA !== null ? <p className="text-sm text-gray-600 mr-3 mt-2">Balance: {roundBalance(balanceA, "")}</p>
            : null}
          </div>
          <div className="flex flex-grow w-full justify-between items-center">
            <input id="amount" type="text" placeholder="0.0"
              onChange={onTokenAInputChange} value={amountA}
              className="w-full h-16 m-1 p-2 text-3xl font-semibold text-gray-700 bg-[#f7f7f7] focus:outline-none"
            />
            <button onClick={()=>setAmountA(balanceA)} type="button"
              className="py-1 px-2 bg-[#bbe2f2] text-[#3dbcf2] text-sm font-bold border border-[#bbe2f2] rounded-lg hover:border-[#1cabe8]"
            >MAX</button>
            { tokenA ?
              <div onClick={()=>setChooseA(true)}
                className="flex flex-grow items-center py-1 px-2 pr-6 mx-2 hover:bg-gray-200 rounded-xl cursor-pointer"
              >
                <p className="py-1 px-2 text-gray-600 text-xl rounded-lg font-semibold">{tokenA.symbol}</p>
                <img src={arrowGray} className="w-3 h-3"/>
              </div> :
              <div onClick={()=>setChooseA(true)} 
                className="flex flex-grow w-96 items-center justify-end py-1 px-2 pr-3 mx-2 bg-[#3dbcf2] hover:bg-[#1cabe8] rounded-xl cursor-pointer"
              >
                <p className="py-1 pr-2 text-[#f7f7f7] text-sm">select token</p>
                <img src={arrowWhite} className="w-3 h-3"/>
              </div>
            }
          </div>
        </div>

        <p className="my-2 text-2xl text-[#3dbcf2] font-semibold">+</p>

        <div className="flex-col flex-grow w-full justify-between items-center rounded-2xl border-2">
          <div className="flex flex-grow w-full justify-between">
            <p className="text-sm text-gray-600 ml-3 mt-2">To</p>
            {balanceB !== null ? <p className="text-sm text-gray-600 mr-3 mt-2">Balance: {roundBalance(balanceB, "")}</p>
            : null}
          </div>
          <div className="flex flex-grow w-full justify-between items-center">
            <input id="amount" type="text" placeholder="0.0" 
              onChange={onTokenBInputChange} value={amountB}
              className="w-full h-16 m-1 p-2 text-3xl font-semibold text-gray-700 bg-[#f7f7f7] focus:outline-none"
            />
            <button onClick={()=>setAmountB(balanceB)} type="button"
              className="py-1 px-2 bg-[#bbe2f2] text-[#3dbcf2] text-sm font-bold border border-[#bbe2f2] rounded-lg hover:border-[#1cabe8]"
            >MAX</button>
            { tokenB ?
              <div onClick={()=>setChooseB(true)}
                className="flex flex-grow items-center py-1 px-2 pr-6 mx-2 hover:bg-gray-200 rounded-xl cursor-pointer"
              >
                <p className="py-1 px-2 text-gray-600 text-xl rounded-lg font-semibold">{tokenB.symbol}</p>
                <img src={arrowGray} className="w-3 h-3"/>
              </div> :
              <div onClick={()=>setChooseB(true)}
                className="flex flex-grow w-96 items-center justify-end py-1 px-2 pr-3 mx-2 bg-[#3dbcf2] hover:bg-[#1cabe8] rounded-xl cursor-pointer"
              >
                <p className="py-1 pr-2 text-[#f7f7f7] text-sm">select token</p>
                <img src={arrowWhite} className="w-3 h-3"/>
              </div>
            }
          </div>
        </div>

        <button onClick={available === 0 ? onAddLiquidity : available === 2 ? onConnectWallet : (event)=>event.preventDefault()} 
          type="submit" className={`w-full mt-2 shadow-none h-14 mx-4 py-2 px-5 text-lg rounded-xl ${buttonStyle}`}
        >{buttonText}</button>
      </form>

      { amountA ? 
        <div className="flex-col w-80 z-0 bg-white rounded-b-xl">
          <div className="flex justify-between mt-4">
            <p className="mx-4 text-gray-600">{ratioAB()}</p>
            <p className="mx-4 text-gray-600">{ratioBA()}</p>
          </div>
          <hr className="mt-2 mx-4 border-gray-300"/>
          <div className="flex justify-between mt-2 mb-3">
            <p className="mx-4 text-gray-600">Share of Pool</p>
            <p className="mx-4 font-semibold text-gray-600">{poolShare*100}%</p>
          </div>
        </div>
      : null }

      { chooseA ? 
        <ChooseToken setChoose={setChooseA} roundBalance={roundBalance} setToken={setTokenA} getBalance={getBalance}
          tokenA={tokenA} tokenB={tokenB}/>
      : null}
      { chooseB ? 
        <ChooseToken setChoose={setChooseB} roundBalance={roundBalance} setToken={setTokenB} getBalance={getBalance}
          tokenA={tokenA} tokenB={tokenB}/>
      : null}
      
    </div>
  )
}

export default AddLiquidity