import React from "react"

const Liquidity = ({ setAddLiquidity, setCreatePool }) => {
  return (
    <div className="flex flex-col flex-grow w-1/2 my-6 bg-[#f7f7f7] rounded-3xl shadow-lg">
      <div className="flex w-full justify-between">
        <p className="text-xl font-semibold m-6">Liquidity</p>
        <div className="flex items-center">
          <button onClick={()=>setAddLiquidity(true)} 
            className="py-2 px-2 mx-2 bg-[#3dbcf2] text-[#f7f7f7] text-sm font-bold rounded-lg hover:bg-[#1cabe8]"
          >Add Liquidity</button>
          <button onClick={()=>setCreatePool(true)} 
            className="py-2 px-2 ml-2 mr-6 bg-[#bbe2f2] text-[#3dbcf2] text-sm font-bold border border-[#bbe2f2] rounded-lg hover:border-[#1cabe8]"
          >Create Pool</button>
        </div>
      </div>
      <div className="flex flex-grow m-4 justify-center border border-gray-300 rounded-2xl">
        <p className="m-2 text-sm text-gray-600">No liquidity found</p>
      </div>
    </div>
  )
}

export default Liquidity