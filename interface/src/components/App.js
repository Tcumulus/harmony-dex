import React, { useState } from "react"
import { ethers } from "ethers"

import Swap from "./Swap"
import Pool from "./Pool"
import Header from "./Header"

function App() {

  const [address, setAddress] = useState(null)
  const [provider, setProvider] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [signer, setSigner] = useState(null)
  const [balance, setBalance] = useState(null)

  const [tokenA, setTokenA] = useState("ONE")
  const [tokenB, setTokenB] = useState("ROY")
  const [balanceA, setBalanceA] = useState(null)
  const [balanceB, setBalanceB] = useState(202.1)

  const [page, setPage] = useState(true)

  const connectWallet = () => {
    if(window.ethereum) {
      window.ethereum.request({method: "eth_requestAccounts"})
      .then(accounts => {
        setAddress(accounts[0])
        updateEthers(accounts[0])
      })
    } else {
      alert("Install Metamask")
    }
  }

  const updateEthers = async (_address) => {
    const _provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(_provider)

    const _network = await _provider.getNetwork()
    const _chainId = _network.chainId
    setChainId(_chainId)

    const _signer = _provider.getSigner()
    setSigner(_signer)

    let _balance = await _provider.getBalance(_address)
    _balance = Number(ethers.utils.formatUnits(_balance, 18))
    setBalance(_balance)

    //temporary
    setBalanceA(_balance)
  }

  const splitAddress = (address) => {
    const _address = address.substring(0,4) + "..." + address.substring(address.length - 3)
    return _address
  }

  const roundBalance = (balance, symbol) => {
    let _balance = Math.round(balance * 1000) / 1000
    _balance = ethers.utils.commify(_balance)
    _balance = _balance + " " + symbol
    return _balance
  }

  return (
    <div className="flex flex-col min-h-screen gradient-bg">
      <Header connectWallet={connectWallet} address={address} chainId={chainId} splitAddress={splitAddress}
              balance={balance} roundBalance={roundBalance} setPage={setPage}/>
      { page ?
      <Swap roundBalance={roundBalance} tokenA={tokenA} tokenB={tokenB} balanceA={balanceA} balanceB={balanceB}
            setTokenA={setTokenA} setTokenB={setTokenB} setBalanceA={setBalanceA} setBalanceB={setBalanceB} /> 
      : <Pool roundBalance={roundBalance}/>
      }
      
    </div>
  );
}

export default App;
