import react, { useState } from "react"
import arrow from "../images/arrow.png"
import crossBlue from "../images/crossBlue.png"

const Pair = ({ pair, setAddLiquidity, roundBalance }) => {
  const [manage, setManage] = useState(false)

  return(
    <div className="flex flex-col w-full justify-between items-center border-b-2">
      {manage ? 
        <div className="flex flex-col h-48 w-full items-between justify-center">
          <div className="flex justify-between w-full mt-4">
            <p className="mx-8 font-bold text-gray-700 text-xl">{pair.symbolA}/{pair.symbolB}</p>
            <div onClick={()=>setManage(false)} className="flex items-center justify-end cursor-pointer">
              <img src={crossBlue} className="w-4 h-4 mr-8"/>
            </div>
          </div>
          <div className="flex flex-row flex-grow justify-between mx-8 mt-4">
            <div>
              <p className="mb-1 text-gray-700">Pool tokens</p>
              <p className="mb-1 text-gray-700">Pooled {pair.symbolA}</p>
              <p className="mb-1 text-gray-700">Pooled {pair.symbolB}</p>
              <p className="mb-1 text-gray-700">Share of pool</p>
            </div>
            <div className="mr-24">
              <p className="mb-1 font-semibold text-gray-700">{roundBalance(pair.amount)}</p>
              <p className="mb-1 font-semibold text-gray-700">{roundBalance(pair.amountA)}</p>
              <p className="mb-1 font-semibold text-gray-700">{roundBalance(pair.amountB)}</p>
              <p className="mb-1 font-semibold text-gray-700">{roundBalance(pair.share, "%")}</p>
            </div>
            <div className="flex flex-col">
              <button onClick={()=>setAddLiquidity(true)} 
                className="w-40 p-1 mb-2 rounded-xl text-[#f7f7f7] font-semibold bg-[#3dbcf2] hover:bg-[#1cabe8]"
              >Add</button>
              <button onClick={()=>console.log("Remove")} 
                className="w-40 p-1 mb-2 rounded-xl text-[#f7f7f7] font-semibold bg-[#3dbcf2] hover:bg-[#1cabe8]"
              >Remove</button>
              <button onClick={()=>console.log("Update")} 
                className="w-40 p-1 rounded-xl text-[#f7f7f7] font-semibold bg-[#3dbcf2] hover:bg-[#1cabe8]"
              >Update</button>
            </div>
          </div>
        </div>
      :
        <div className="flex h-16 w-full justify-between items-center">
          <p className="mx-8 font-bold text-gray-700 text-xl">{pair.symbolA}/{pair.symbolB}</p>
          <div onClick={()=>setManage(true)} className="flex items-center justify-end cursor-pointer">
            <button className="mx-4 font-bold text-[#3dbcf2]">Manage</button>
            <img src={arrow} className="w-4 h-4 mr-8"/>
          </div>
        </div>
      }
    </div>
  )
}

export default Pair