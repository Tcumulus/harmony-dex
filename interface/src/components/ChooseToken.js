import React, { useState, useEffect } from "react"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { firestore } from "../firebase/config"
import Token from "./Token"

const ChooseToken = ({ setChoose, roundBalance, setToken, getBalance, tokenA, tokenB }) => {
  let query = firestore.collection("tokens")
  query = query.orderBy("tokenAddress")
  const [tokens] = useCollectionData(query, {idField: "id"})
  
  const [displayedTokens, setDisplayedTokens] = useState(null)

  useEffect(() => {
    if(tokens) {
      setDisplayedTokens(tokens)
    }
  }, [tokens])

  const onInputChange = (event) => {
    const val = event.target.value
    if (val.length !== 0) {
      let _tokens = []
      tokens.forEach(token => {
        if (val === token.tokenAddress) {
          _tokens.push(token)
        }
        else if (val.toLowerCase() === token.name.substring(0,val.length).toLowerCase()) {
          _tokens.push(token)
        }
        else if (val.toLowerCase() === token.symbol.substring(0,val.length).toLowerCase()) {
          _tokens.push(token)
        }
      })
      setDisplayedTokens(_tokens)
    }
    else {
      setDisplayedTokens(tokens)
    }
  }

  return(
    <div>
      <div className="flex fixed justify-center inset-0 z-50">
        <div className="flex flex-col bg-[#f7f7f7] h-5/6 mt-16 w-96 rounded-3xl shadow-lg">
          <div className="flex w-full justify-between items-center mt-4">
            <p className="ml-4 text-gray-600 font-semibold">Select token</p>
            <button onClick={()=>setChoose(false)} 
                    className="mr-4 font-bold text-2xl text-gray-600 cursor pointer">x</button>
          </div>
          <input placeholder="Token address or symbol" onChange={onInputChange} 
            className="h-16 m-4 mt-6 p-2 text-xl text-gray-600 bg-[#f7f7f7] border-2 rounded-2xl focus:outline-none"
          />
          
          <div className="h-full mb-6 border overflow-y-auto">
            {displayedTokens && displayedTokens.map(token => 
              <Token key={token.tokenAddress} token={token} roundBalance={roundBalance} setToken={setToken}
                setChoose={setChoose} getBalance={getBalance} tokenA={tokenA} tokenB={tokenB}/>
            )}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
    </div>
  )
}

export default ChooseToken