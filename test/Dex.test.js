const { assert } = require("chai")
const DEX = artifacts.require("DEX")
const Natrium = artifacts.require("Natrium")
const Oxygen = artifacts.require("Oxygen")

let dex = null
let natrium = null
let oxygen = null

contract("Natrium", (accounts) => {
  it("Deploy contract", async () => {
    natrium = await Natrium.deployed()
    assert(natrium !== null)
  })
})

contract("Oxygen", (accounts) => {
  it("Deploy contract", async () => {
    oxygen = await Oxygen.deployed()
    assert(oxygen !== null)
  })
})

contract("DEX", (accounts) => {
  it("Deploy contract", async () => {
    dex = await DEX.deployed()
    assert(dex !== null)
  })
  it("Create new liquidity pool", async () => {
    await dex.addLP("Natrium-Oxygen", "NATOXY", natrium.address, oxygen.address)
    let addressPair = await dex.getPairs(natrium.address, oxygen.address)
    assert(addressPair == await dex.pairs(0))
  })
})