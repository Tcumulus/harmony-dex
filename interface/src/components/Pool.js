import React, { useState } from "react"
import Liquidity from "./Liquidity"
import AddLiquidity from "./AddLiquidity"
import CreatePool from "./CreatePool"

const Pool = ({ roundBalance, chainId, connectWallet }) => {
  const [addLiquidity, setAddLiquidity] = useState(false)
  const [createPool, setCreatePool] = useState(false)

  return(
    <div className="flex flex-col flex-grow items-center">
      {addLiquidity || createPool ? null :
        <Liquidity setAddLiquidity={setAddLiquidity} setCreatePool={setCreatePool} />
      }

      {addLiquidity ?
        <AddLiquidity roundBalance={roundBalance} setAddLiquidity={setAddLiquidity} chainId={chainId}
          connectWallet={connectWallet}/> 
      :null }

      {createPool ?
        <CreatePool roundBalance={roundBalance} setCreatePool={setCreatePool} chainId={chainId}
          connectWallet={connectWallet}/>
      : null}
    </div>
  )
}

export default Pool