const { assert } = require("chai")
const { ethers } = require("ethers")
const Natrium = artifacts.require("Natrium")
const Oxygen = artifacts.require("Oxygen")
const LP = artifacts.require("LP")

let lp = null
let natrium = null
let oxygen = null
const decimals = 18

function toWei (n) {
  return n * (10**18)
}

contract("Natrium", (accounts) => {
  it("Deploy contract", async () => {
    natrium = await Natrium.deployed()
    assert(natrium !== null)
  })
  it("Give owner 1000000 tokens", async () => {
    const balance = await natrium.balanceOf(accounts[0])
    assert(balance.toString() == toWei(1000000))
  })
})

contract("Oxygen", (accounts) => {
  it("Deploy contract", async () => {
    oxygen = await Oxygen.deployed()
    assert(oxygen !== null)
  })
  it("Give owner 100000 tokens", async () => {
    const balance = await oxygen.balanceOf(accounts[0])
    assert(balance.toString() == toWei(100000))
  })
})

contract("LP constructor", () => {
  it("Deploy contract", async () => {
    lp = await LP.deployed()
    assert(lp !== null)
  })
  it("Symbol check", async () => {
    assert(await lp.symbol() == "NATOXY")
  })
  it("TokenA check", async () => {
    assert(await lp.addressTokenA() == natrium.address)
  })
})

contract("LP addLiquidity", (accounts) => {
  let amountA1 = ethers.BigNumber.from("100" + "000000000000000000")
  let amountB1 = ethers.BigNumber.from("10" + "000000000000000000")
  it("Add liquidity #1", async () => {
    await natrium.approve(lp.address, amountA1, { from: accounts[0] })
    await oxygen.approve(lp.address, amountB1, { from: accounts[0] })
    await lp.addLiquidity(amountA1, amountB1)
    const _lockedTokenA = await lp.lockedTokenA()
    assert(_lockedTokenA.toString() == amountA1.toString())
  })
  
  let amountA2 = 200
  it("Add liquidity #2", async () => {
    let a = await lp.lockedTokenA()
    let b = await lp.lockedTokenB()
    a = Number(ethers.utils.formatUnits(a.toString(), decimals)) //to right BN
    b = Number(ethers.utils.formatUnits(b.toString(), decimals))

    let amountB2 = b * amountA2 / a //calculate amount tokenB
    amountB2 = ethers.utils.parseUnits(amountB2.toString(), decimals) //toWei
    amountA2 = ethers.utils.parseUnits(amountA2.toString(), decimals)
    await natrium.approve(lp.address, amountA2, { from: accounts[0] })
    await oxygen.approve(lp.address, amountB2, { from: accounts[0] })
    await lp.addLiquidity(amountA2, amountB2)
    const _lockedTokenA = await lp.lockedTokenA()
    assert(_lockedTokenA.toString() == amountA2.add(amountA1))
  })

  it("Distribute LP tokens", async () => {
    lptAmount = await lp.balanceOf(accounts[0])
    console.log(lptAmount.toString())
    assert(lptAmount.toString() > 0)
  })
})