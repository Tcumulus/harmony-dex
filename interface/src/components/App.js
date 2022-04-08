import React, { useState, createContext } from "react"
import { ethers } from "ethers"

import Swap from "./swap/Swap"
import Pool from "./pool/Pool"
import Header from "./Header"

export const Context = createContext(null)

function App() {
  const [address, setAddress] = useState(null)
  const [provider, setProvider] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [signer, setSigner] = useState(null)
  const [balance, setBalance] = useState(null)

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
  }

  const splitAddress = (address) => {
    const _address = address.substring(0,4) + "..." + address.substring(address.length - 3)
    return _address
  }

  const roundBalance = (balance, symbol = "") => {
    if(balance){
      let _balance = balance
      if (_balance >= 1000) {
        _balance = Math.round(_balance)
        _balance = balance.toPrecision(_balance.toString().length)
      } else if (_balance < 0.00001) {
        _balance = 0
      } else {
        _balance = balance.toPrecision(4)
      }
      _balance = ethers.utils.commify(_balance)
      _balance = _balance + " " + symbol
      return _balance
    } return "- " + symbol
  }

  return (
    <Context.Provider value={ {signer, address, balance} }>
      <div className="flex flex-col min-h-screen gradient-bg">
        <Header connectWallet={connectWallet} address={address} chainId={chainId} splitAddress={splitAddress}
                balance={balance} roundBalance={roundBalance} setPage={setPage}/>
        { page ?
        <Swap roundBalance={roundBalance} chainId={chainId} connectWallet={connectWallet}/> 
        : <Pool roundBalance={roundBalance} chainId={chainId} connectWallet={connectWallet}/>
        }
      </div>
    </Context.Provider>
  );
}

export default App;
