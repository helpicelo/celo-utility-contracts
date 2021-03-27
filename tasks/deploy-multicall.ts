import { deployContract } from "@ubeswap/solidity-create2-deployer";
import { ActionType } from "hardhat/types";
import multicall from "../build/artifacts/contracts/Multicall.sol/Multicall.json";

const salt = "ubeswap-multicall";

export const deployMulticall: ActionType<{}> = async (_, hre) => {
  const [deployer] = hre.celo.getSigners();
  if (!deployer) {
    throw new Error("Deployer not found.");
  }

  const res = await deployContract({
    salt,
    contractBytecode: multicall.bytecode,
    signer: deployer,
  });

  console.log("Multicall:", res.address);
};
