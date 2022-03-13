const { assert } = require("chai")
const Migrations = artifacts.require("Migrations")

contract("Migrations", () => {
  it("should deploy contract", async () => {
    const migrations = await Migrations.deployed()
    assert(migrations.address !== "")
  })
})