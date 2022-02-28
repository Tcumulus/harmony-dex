const Natrium = artifacts.require("Natrium")
const Oxygen = artifacts.require("Oxygen")
const DEX = artifacts.require("DEX")

module.exports = async function (deployer) {
  await deployer.deploy(Natrium)
  await deployer.deploy(Oxygen)
  await deployer.deploy(DEX)
};