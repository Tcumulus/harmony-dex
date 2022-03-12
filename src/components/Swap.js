import React, { useState } from "react"
import arrow from "../images/arrow.png"
import arrowGray from "../images/arrowGray.png"

const buttonStyle = `mx-4 py-2 px-5 bg-[#3dbcf2] text-lg rounded-xl text-[#f7f7f7] drop-shadow-lg hover:bg-[#1cabe8] cursor-pointer`


const Swap = ({ roundBalance }) => {
  const bal2 = 102.39
  const bal1 = 9.981
  
  const [amountA, setAmountA] = useState("")
  const [amountB, setAmountB] = useState("")
  const [fee, setFee] = useState(0)

  const onTokenAInputChange = (event) => {
    setAmountA(event.target.value)
    setFee(event.target.value * 0.003)
  }

  const onTokenBInputChange = (event) => {
    setAmountB(event.target.value)
  }

  const maxTokenAInput = () => {
    console.log("maxTokenAInput")
  }

  const onTokenAChange = () => {
    console.log("tokenAChange")
  }

  const onTokenBChange = () => {
    console.log("tokenBChange")
  }

  const onSwitchTokens = () => {
    console.log("switchTokens")
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
            <p className="text-sm text-gray-600 mr-3 mt-2">Balance: {bal1}</p>
          </div>
          <div className="flex flex-grow w-full justify-between items-center">
            <input id="amount" type="text" placeholder="0.0" step="0.001" 
              onChange={onTokenAInputChange} value={amountA}
              className="w-full h-16 m-1 p-2 text-3xl font-semibold text-gray-700 bg-[#f7f7f7] focus:outline-none"
            />
            <button onClick={maxTokenAInput} type="button"
              className="py-1 px-2 bg-[#bbe2f2] text-[#3dbcf2] text-sm font-bold shadow-none rounded-lg"
            >MAX</button>
            <div onClick={onTokenAChange}
              className="flex flex-grow items-center py-1 px-2 pr-6 mx-2 hover:bg-gray-200 rounded-xl"
            >
              <p className="py-1 px-2 text-gray-600 text-xl shadow-none rounded-lg font-semibold">ONE</p>
              <img src={arrowGray} className="w-3 h-3 cursor-pointer"/>
            </div>
          </div>
        </div>

        <img src={arrow} onClick={onSwitchTokens} className="w-6 h-6 my-3 cursor-pointer"/>

        <div className="flex-col flex-grow w-full justify-between items-center rounded-2xl border-2">
          <div className="flex flex-grow w-full justify-between">
            <p className="text-sm text-gray-600 ml-3 mt-2">To</p>
            <p className="text-sm text-gray-600 mr-3 mt-2">Balance: {bal2}</p>
          </div>
          <div className="flex flex-grow w-full justify-between items-center">
          <input id="amount" type="text" placeholder="0.0" step="0.001" 
              onChange={onTokenBInputChange} value={amountB}
              className="w-full h-16 m-1 p-2 text-3xl font-semibold text-gray-700 bg-[#f7f7f7] focus:outline-none"
            />
            <div onClick={onTokenBChange}
              className="flex flex-grow items-center py-1 px-2 pr-6 mx-2 hover:bg-gray-200 rounded-xl"
            >
              <p className="py-1 px-2 text-gray-600 text-xl shadow-none rounded-lg font-semibold">ROY</p>
              <img src={arrowGray} className="w-3 h-3 cursor-pointer"/>
            </div>
          </div>
        </div>

        <div className="flex flex-grow w-full justify-between items-center">
          <p className="mx-4 my-2 text-sm font-semibold text-gray-600">Price</p>
          <p className="mx-4 my-2 text-sm font-semibold text-gray-600">0.8 ONE for 1 ROY</p>
        </div>

        <button onClick={onSwap} type="submit" className={`w-full shadow-none ${buttonStyle}`}>Swap</button>
      </form>

      { amountA ? 
        <div className="flex-col w-80 z-0 bg-white rounded-b-xl">
          <div className="flex justify-between mt-4">
            <p className="mx-4 text-gray-600">Price Impact</p>
            <p className="mx-4 font-semibold text-gray-600">0.10%</p>
          </div>
          <div className="flex justify-between mt-1 mb-3">
            <p className="mx-4 text-gray-600">Fee</p>
            <p className="mx-4 font-semibold text-gray-600">{roundBalance(fee)}</p>
          </div>
        </div>
      : null }
    </div>
  )
}

export default Swap