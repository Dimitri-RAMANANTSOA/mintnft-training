const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const tokens = require("./whitelist.json");

async function main() {

  let tab = [];
  tokens.map(token => {
    tab.push(token.address);
  })
  const leaves = tab.map(address => keccak256(address));
  const tree = new MerkleTree(leaves, keccak256, { sort: true});
  const root = tree.getHexRoot();

  const MintNFT = await hre.ethers.getContractFactory("MintNFT");
  const mintnft = await MintNFT.deploy("VLMNFT", "VLM", root);

  await mintnft.deployed();

  console.log(
    `Contract deployed to ${mintnft.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
