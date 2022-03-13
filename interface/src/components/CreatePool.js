import React, {useState} from "react"
import arrowGray from "../images/arrowGray.png"
import ChooseToken from "./ChooseToken"

const CreatePool = ({ roundBalance, setCreatePool }) => {
  const [amountA, setAmountA] = useState("")
  const [amountB, setAmountB] = useState("")
  const [chooseA, setChooseA] = useState(false)
  const [chooseB, setChooseB] = useState(false)

  const [tokenA, setTokenA] = useState("ONE")
  const [tokenB, setTokenB] = useState("ROY")
  const [balanceA, setBalanceA] = useState(9.81)
  const [balanceB, setBalanceB] = useState(421.7)

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

  const onTokenAChange = () => {
    setChooseA(true)
  }

  const onTokenBChange = () => {
    setChooseB(true)
  }

  const onProvide = () => {
    console.log("Provide")
  }

  const ratioAB = () => {
    if(amountA && amountB) {
      return roundBalance(amountA/amountB, tokenA + "/" + tokenB)
    }
  }

  const ratioBA = () => {
    if(amountA && amountB) {
      return roundBalance(amountB/amountA, tokenB + "/" + tokenA)
    }
  }

  return (
    <div className="flex flex-col flex-grow items-center pt-6">
      <form 
        onSubmit={onTokenAInputChange} autoComplete="off" 
        className="flex flex-col items-center z-10 w-96 p-4 mt-10 bg-[#f7f7f7] rounded-2xl shadow-xl"
      >
        <div className="flex w-full items-center justify-between pl-2 pt-1 pb-3">
          <p className="font-semibold text-gray-600">Create pool</p>
          <button onClick={()=>setCreatePool(false)} 
                    className="mr-4 font-bold text-2xl text-gray-600 cursor pointer">x</button>
        </div>

        <div className="flex-col flex-grow w-full justify-between items-center rounded-2xl border-2">
          <div className="flex flex-grow w-full justify-between">
            <p className="text-sm text-gray-600 ml-3 mt-2">Input</p>
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

        <p className="my-2 text-2xl text-[#3dbcf2] font-semibold">+</p>

        <div className="flex-col flex-grow w-full justify-between items-center rounded-2xl border-2">
          <div className="flex flex-grow w-full justify-between">
            <p className="text-sm text-gray-600 ml-3 mt-2">Input</p>
            {balanceB ? <p className="text-sm text-gray-600 mr-3 mt-2">Balance: {roundBalance(balanceB, tokenB)}</p>
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
            <div onClick={onTokenBChange}
              className="flex flex-grow items-center py-1 px-2 pr-6 mx-2 hover:bg-gray-200 rounded-xl cursor-pointer"
            >
              <p className="py-1 px-2 text-gray-600 text-xl rounded-lg font-semibold">{tokenB}</p>
              <img src={arrowGray} className="w-3 h-3"/>
            </div>
          </div>
        </div>

        <button onClick={onProvide} type="submit" className="w-full mt-4 h-14 mx-4 py-2 px-5 bg-[#3dbcf2] text-lg rounded-xl text-[#f7f7f7] hover:bg-[#1cabe8] cursor-pointer">
          Provide Liquidity
        </button>
      </form>

      { amountA ? 
        <div className="flex-col w-80 z-0 bg-white rounded-b-xl">
          <div className="flex justify-between my-4">
            <p className="mx-4 font-semibold text-gray-600">{ratioAB()}</p>
            <p className="mx-4 font-semibold text-gray-600">{ratioBA()}</p>
          </div>
        </div>
      : null }

      { chooseA ? <ChooseToken setChoose={setChooseA} />: null}
      { chooseB ? <ChooseToken setChoose={setChooseB} />: null}
      
    </div>
  )
}

export default CreatePool