const { assert } = require("chai")
const DEX = artifacts.require("DEX")
const Natrium = artifacts.require("Natrium")
const Oxygen = artifacts.require("Oxygen")

let dex = null
let natrium = null
let oxygen = null

function toWei (n) {
  return n * (10**18)
}

contract("Natrium", (accounts) => {
  it("should deploy contract", async () => {
    natrium = await Natrium.deployed()
    assert(natrium !== null)
  })
  it("should give owner 1000000 tokens", async () => {
    const balance = await natrium.balanceOf.call(accounts[0])
    assert(balance.toString() == toWei(1000000))
  })
})

contract("Oxygen", (accounts) => {
  it("should deploy contract", async () => {
    oxygen = await Oxygen.deployed()
    assert(oxygen !== null)
  })
  it("should give owner 100000 tokens", async () => {
    const balance = await oxygen.balanceOf.call(accounts[0])
    assert(balance.toString() == toWei(100000))
  })
})

contract("DEX", (accounts) => {
  it("Deploy contract", async () => {
    dex = await DEX.deployed()
    assert(dex !== null)
  })
  it("Create new liquidity pool", async () => {
    await dex.addLP("Natrium-Oxygen", "NATOXY", natrium.address, oxygen.address)
    addressPair = await dex.getPairs(natrium.address, oxygen.address)
    assert(addressPair == await dex.pairs(0))
  })
})