import React, { useState } from "react"
import arrow from "../images/arrow.png"
import arrowGray from "../images/arrowGray.png"

import ChooseToken from "./ChooseToken"

const buttonStyle = `mx-4 py-2 px-5 bg-[#3dbcf2] text-lg rounded-xl text-[#f7f7f7] drop-shadow-lg hover:bg-[#1cabe8] cursor-pointer`


const Swap = ({ 
  roundBalance, tokenA, tokenB, balanceA, balanceB, setTokenA, setTokenB, setBalanceA, setBalanceB 
}) => {

  const [amountA, setAmountA] = useState("")
  const [amountB, setAmountB] = useState("")
  const [fee, setFee] = useState(0)
  const [chooseA, setChooseA] = useState(false)
  const [chooseB, setChooseB] = useState(false)

  const onTokenAInputChange = (event) => {
    const val = event.target.value
    if (val >= 0) {
      setAmountA(val)
      setFee(val * 0.003)
    }
  }

  const onTokenBInputChange = (event) => {
    const val = event.target.value
    if (val >= 0) {
      setAmountB(val)
    }
  }

  const onTokenAChange = () => {
    setChooseA(true)
  }

  const onTokenBChange = () => {
    setChooseB(true)
  }

  const onSwitchTokens = () => {
    setTokenA(tokenB)
    setTokenB(tokenA)
    setBalanceA(balanceB)
    setBalanceB(balanceA)
    setAmountA(amountB)
    setAmountB(amountA)
  }

  const onSwap = () => {
    console.log("Swap")
  }

  return(
    <div className="flex flex-col flex-grow items-center pt-6">
      <form 
        onSubmit={onTokenAInputChange} autoComplete="off" 
        className="flex flex-col items-center z-10 w-96 p-4 mt-10 bg-[#f7f7f7] rounded-2xl shadow-xl"
      >
        <div className="flex w-full items-left">
          <p className="font-semibold text-gray-600 pl-2 pt-1 pb-3">Swap</p>
        </div>

        <div className="flex-col flex-grow w-full justify-between items-center rounded-2xl border-2">
          <div className="flex flex-grow w-full justify-between">
            <p className="text-sm text-gray-600 ml-3 mt-2">From</p>
            {balanceA ? <p className="text-sm text-gray-600 mr-3 mt-2">Balance: {roundBalance(balanceA, tokenA)}</p>
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
            <div onClick={onTokenAChange}
              className="flex flex-grow items-center py-1 px-2 pr-6 mx-2 hover:bg-gray-200 rounded-xl cursor-pointer"
            >
              <p className="py-1 px-2 text-gray-600 text-xl rounded-lg font-semibold">{tokenA}</p>
              <img src={arrowGray} className="w-3 h-3"/>
            </div>
          </div>
        </div>

        <img src={arrow} onClick={onSwitchTokens} className="w-6 h-6 my-3 cursor-pointer"/>

        <div className="flex-col flex-grow w-full justify-between items-center rounded-2xl border-2">
          <div className="flex flex-grow w-full justify-between">
            <p className="text-sm text-gray-600 ml-3 mt-2">To</p>
            {balanceB ? <p className="text-sm text-gray-600 mr-3 mt-2">Balance: {roundBalance(balanceB, tokenB)}</p>
            : null}
          </div>
          <div className="flex flex-grow w-full justify-between items-center">
          <input id="amount" type="text" placeholder="0.0" 
              onChange={onTokenBInputChange} value={amountB}
              className="w-full h-16 m-1 p-2 text-3xl font-semibold text-gray-700 bg-[#f7f7f7] focus:outline-none"
            />
            <div onClick={onTokenBChange}
              className="flex flex-grow items-center py-1 px-2 pr-6 mx-2 hover:bg-gray-200 rounded-xl cursor-pointer"
            >
              <p className="py-1 px-2 text-gray-600 text-xl rounded-lg font-semibold">{tokenB}</p>
              <img src={arrowGray} className="w-3 h-3"/>
            </div>
          </div>
        </div>

        <div className="flex flex-grow w-full justify-between items-center">
          <p className="mx-4 my-2 text-sm font-semibold text-gray-600">Price</p>
          <p className="mx-4 my-2 text-sm font-semibold text-gray-600">0.8 {tokenA} for 1 {tokenB}</p>
        </div>

        <button onClick={onSwap} type="submit" className={`w-full mt-2 shadow-none h-14 ${buttonStyle}`}>Swap</button>
      </form>

      { amountA ? 
        <div className="flex-col w-80 z-0 bg-white rounded-b-xl">
          <div className="flex justify-between mt-4">
            <p className="mx-4 text-gray-600">Price Impact</p>
            <p className="mx-4 font-semibold text-gray-600">0.10%</p>
          </div>
          <div className="flex justify-between mt-1 mb-3">
            <p className="mx-4 text-gray-600">Fee</p>
            <p className="mx-4 font-semibold text-gray-600">{roundBalance(fee, tokenA)}</p>
          </div>
        </div>
      : null }

      { chooseA ? <ChooseToken setChoose={setChooseA} />: null}
      { chooseB ? <ChooseToken setChoose={setChooseB} />: null}
      
    </div>
  )
}

export default Swap