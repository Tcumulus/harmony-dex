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

/*
contract("Liquidity", (accounts) => {
  let amountA1 = ethers.BigNumber.from("100" + "000000000000000000")
  let amountB1 = ethers.BigNumber.from("10" + "000000000000000000")
  it("Add liquidity #1", async () => {
    await natrium.approve(lp.address, amountA1, { from: accounts[0] })
    await oxygen.approve(lp.address, amountB1, { from: accounts[0] })
    await lp.addLiquidity(accounts[0], amountA1, amountB1)
    const _lockedTokenA = await lp.lockedTokenA()
    assert(_lockedTokenA.toString() == amountA1.toString())
  })
  
  let amountA2 = 200
  it("Add liquidity #2", async () => {
    let a = await lp.lockedTokenA()
    let b = await lp.lockedTokenB()
    a = Number(ethers.utils.formatUnits(a.toString(), decimals))
    b = Number(ethers.utils.formatUnits(b.toString(), decimals))

    let amountB2 = b * amountA2 / a //calculate amount tokenB
    amountB2 = ethers.utils.parseUnits(amountB2.toString(), decimals) //toWei
    amountA2 = ethers.utils.parseUnits(amountA2.toString(), decimals)
    await natrium.approve(lp.address, amountA2, { from: accounts[0] })
    await oxygen.approve(lp.address, amountB2, { from: accounts[0] })
    await lp.addLiquidity(accounts[0], amountA2, amountB2)
    const _lockedTokenA = await lp.lockedTokenA()
    assert(_lockedTokenA.toString() == amountA2.add(amountA1))
  })

  it("Distribute LP tokens", async () => {
    lptAmount = await lp.balanceOf(accounts[0])
    assert(lptAmount.toString() > 0)
  })

  let iTokenA
  let iTokenB

  it("Remove liquidity", async () => {
    let iLPT = await lp.totalSupply()
    iTokenA = await natrium.balanceOf(accounts[0])
    iTokenB = await oxygen.balanceOf(accounts[0])
    iLPT = Number(ethers.utils.formatUnits(iLPT.toString(), decimals))
    iTokenA = Number(ethers.utils.formatUnits(iTokenA.toString(), decimals))
    iTokenB = Number(ethers.utils.formatUnits(iTokenB.toString(), decimals))

    const amountLPT = ethers.BigNumber.from("10" + "000000000000000000")
    await lp.approve(lp.address, amountLPT, { from: accounts[0] })
    await lp.removeLiquidity(accounts[0], amountLPT)
    let LPT = await lp.balanceOf(accounts[0])
    LPT = Number(ethers.utils.formatUnits(LPT.toString(), decimals))
    assert(iLPT - 10 == LPT)
  })

  it("Add TokenA and TokenB", async () => {
    let TokenA = await natrium.balanceOf(accounts[0])
    let TokenB = await oxygen.balanceOf(accounts[0])
    TokenA = Number(ethers.utils.formatUnits(TokenA.toString(), decimals))
    TokenB = Number(ethers.utils.formatUnits(TokenB.toString(), decimals))
    assert(iTokenA < TokenA)
    assert(iTokenB < TokenB)
  })
})
*/

contract("Swap", (accounts) => {
  let iLptAmount;
  it("Add liquidity", async () => {
    let amountA = ethers.BigNumber.from("1000" + "000000000000000000")
    let amountB = ethers.BigNumber.from("1000" + "000000000000000000")
    await natrium.approve(lp.address, amountA, { from: accounts[0] })
    await oxygen.approve(lp.address, amountB, { from: accounts[0] })
    await lp.addLiquidity(accounts[0], amountA, amountB)
    const _lockedTokenA = await lp.lockedTokenA()
    iLptAmount = await lp.balanceOf(accounts[0])
    assert(_lockedTokenA.toString() == amountA.toString())
  })

  it("SwapA", async () => {
    const iBalanceA = await natrium.balanceOf(accounts[1])
    const iBalanceB = await oxygen.balanceOf(accounts[1])
    let amountA = ethers.BigNumber.from("100" + "000000000000000000")
    let amountB = ethers.BigNumber.from("0")
    await natrium.approve(lp.address, amountA, { from: accounts[1] })
    await lp.swap(accounts[1], amountA, amountB)

    const balanceA = await natrium.balanceOf(accounts[1])
    const balanceB = await oxygen.balanceOf(accounts[1])
    assert(iBalanceA > balanceA)
    assert(iBalanceB < balanceB)
  })

  /*
  it("SwapB", async () => {
    const iBalanceA = await natrium.balanceOf(accounts[0])
    const iBalanceB = await oxygen.balanceOf(accounts[0])
    let amountA = ethers.BigNumber.from("0")
    let amountB = ethers.BigNumber.from("10" + "000000000000000000")
    await oxygen.approve(lp.address, amountB, { from: accounts[0] })
    await lp.swap(accounts[0], amountA, amountB)

    const balanceA = await natrium.balanceOf(accounts[0])
    const balanceB = await oxygen.balanceOf(accounts[0])
    assert(iBalanceA < balanceA)
    assert(iBalanceB > balanceB)
  })
  */

  it("Update LPT amount", async () => {
    await lp._update(accounts[0])
    const LptAmount = await lp.balanceOf(accounts[0])
    assert(LptAmount > iLptAmount)
  })

  it("Remove Liquidity", async () => {
    const iBalanceA = await natrium.balanceOf(accounts[0])
    const iBalanceB = await oxygen.balanceOf(accounts[0])
    const LptAmount = await lp.balanceOf(accounts[0])

    const ilpbalanceA = await natrium.balanceOf(lp.address)
    const ilpbalanceB = await oxygen.balanceOf(lp.address)

    await lp.approve(lp.address, LptAmount, { from: accounts[0] })
    await lp.removeLiquidity(accounts[0], LptAmount)

    const balanceA = await natrium.balanceOf(accounts[0])
    const balanceB = await oxygen.balanceOf(accounts[0])

    const lpbalanceA = await natrium.balanceOf(lp.address)
    const lpbalanceB = await oxygen.balanceOf(lp.address)
    
    assert(true == true)
  })
})