import React from "react"

const ChooseToken = ({ setChoose }) => {
  return(
    <div>
      <div className="flex fixed justify-center inset-0 z-50">
        <div className="flex flex-col bg-[#f7f7f7] h-5/6 mt-16 w-96 rounded-3xl shadow-lg">
          <div className="flex w-full justify-between items-center mt-4">
            <p className="ml-4 text-gray-600 font-semibold">Select token</p>
            <button onClick={()=>setChoose(false)} 
                    className="mr-4 font-bold text-2xl text-gray-600 cursor pointer">x</button>
          </div>
          <input className="h-16 m-4 mt-6 p-2 text-xl text-gray-600 bg-[#f7f7f7] border-2 rounded-2xl focus:outline-none"
            placeholder="Token address or symbol"
          />
          {/*tokenlist*/}
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
    </div>
  )
}

export default ChooseToken