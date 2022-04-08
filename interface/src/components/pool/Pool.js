import React, { useState, useContext } from "react"
import { firestore } from "../../firebase/config"

import Liquidity from "./Liquidity"
import AddLiquidity from "./AddLiquidity"
import CreatePool from "./CreatePool"
import { Context } from "../App"

const Pool = ({ roundBalance, chainId, connectWallet }) => {
  const [addLiquidity, setAddLiquidity] = useState(false)
  const [createPool, setCreatePool] = useState(false)

  let { signer, address, balance } = useContext(Context)
  address ? address=address : address = "noAddress"
  const pairsRef = firestore.collection("liquidity").doc(address).collection("pairs")


  const addToFirebase = async (tokenA, tokenB, amountA, amountB) => {
    let collectionA = await pairsRef.where("symbol", "==", tokenA.symbol + tokenB.symbol).get()
    collectionA = collectionA.docs
    let collectionB = await pairsRef.where("symbol", "==", tokenB.symbol + tokenA.symbol).get()
    collectionB = collectionB.docs

    //TODO: update pool share and amount
    if (collectionA.length > 0) {
      const setAmountA = Number(collectionA[0].data().amountA) + Number(amountA)
      const setAmountB = Number(collectionA[0].data().amountB) + Number(amountB)
      pairsRef.doc(collectionA[0].id).update({ "amountA": setAmountA, "amountB": setAmountB })
    } else if (collectionB.length > 0) {
      const setAmountA = Number(collectionB[0].data().amountA) + Number(amountB)
      const setAmountB = Number(collectionB[0].data().amountB) + Number(amountA)
      pairsRef.doc(collectionB[0].id).update({ "amountA": setAmountA, "amountB": setAmountB })
    } else {
      pairsRef.add({
        "addressA": tokenA.tokenAddress,
        "addressB": tokenB.tokenAddress,
        "amount": 10,
        "amountA": Number(amountA),
        "amountB": Number(amountB),
        "share": 0.11,
        "symbol": tokenA.symbol + tokenB.symbol,
        "symbolA": tokenA.symbol,
        "symbolB": tokenB.symbol
      })
    }

    collectionA = await firestore.collection("pairs").where("symbol", "==", tokenA.symbol + tokenB.symbol).get()
    collectionA = collectionA.docs
    collectionB = await firestore.collection("pairs").where("symbol", "==", tokenB.symbol + tokenA.symbol).get()
    collectionB = collectionB.docs

    //TODO: update pool share and amount 
    if (collectionA.length > 0) {
      const setAmountA = Number(collectionA[0].data().amountA) + Number(amountA)
      const setAmountB = Number(collectionA[0].data().amountB) + Number(amountB)
      firestore.collection("pairs").doc(collectionA[0].id).update({ "amountA": setAmountA, "amountB": setAmountB })
    } else if (collectionB.length > 0) {
      const setAmountA = Number(collectionB[0].data().amountA) + Number(amountB)
      const setAmountB = Number(collectionB[0].data().amountB) + Number(amountA)
      firestore.collection("pairs").doc(collectionB[0].id).update({ "amountA": setAmountA, "amountB": setAmountB })
    } else {
      firestore.collection("pairs").add({
        "addressA": tokenA.tokenAddress,
        "addressB": tokenB.tokenAddress,
        "amount": 10,
        "amountA": Number(amountA),
        "amountB": Number(amountB),
        "share": 0.11,
        "symbol": tokenA.symbol + tokenB.symbol,
        "symbolA": tokenA.symbol,
        "symbolB": tokenB.symbol
      })
    }
  }

  return(
    <div className="flex flex-col flex-grow items-center">
      {addLiquidity || createPool ? null :
        <Liquidity setAddLiquidity={setAddLiquidity} setCreatePool={setCreatePool} roundBalance={roundBalance}/>
      }

      {addLiquidity ?
        <AddLiquidity roundBalance={roundBalance} setAddLiquidity={setAddLiquidity} chainId={chainId}
          connectWallet={connectWallet} addToFirebase={addToFirebase}/> 
      :null }

      {createPool ?
        <CreatePool roundBalance={roundBalance} setCreatePool={setCreatePool} chainId={chainId}
          connectWallet={connectWallet} addToFirebase={addToFirebase}/>
      : null}
    </div>
  )
}

export default Pool