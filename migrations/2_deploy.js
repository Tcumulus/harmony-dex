const Natrium = artifacts.require("Natrium")
const Oxygen = artifacts.require("Oxygen")
const DEX = artifacts.require("DEX")
const LP = artifacts.require("LP")

module.exports = async function (deployer) {
  await deployer.deploy(Natrium)
  await deployer.deploy(Oxygen)
  await deployer.deploy(DEX)

  const natrium = await Natrium.deployed()
  const oxygen = await Oxygen.deployed()
  await deployer.deploy(LP, "Natrium-Oxygen", "NATOXY", natrium.address, oxygen.address)
};