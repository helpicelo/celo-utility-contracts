import { CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import {
  deployerAddress,
  deployerKey,
  factoryBytecode,
} from "@ubeswap/solidity-create2-deployer";
import { ActionType } from "hardhat/types";

export const deployCreate2: ActionType<{}> = async (_, hre) => {
  const [deployer] = hre.celo.getSigners();
  if (!deployer) {
    throw new Error("Deployer not found.");
  }

  console.log("Send $0.10 to funding addr");
  const cUSD = await hre.celo.kit.contracts.getStableToken();
  await (
    await cUSD.transfer(deployerAddress, "10000000000000000").send({
      from: await deployer.getAddress(),
      gas: 5000000,
      gasPrice: 10 ** 9,
      feeCurrency: cUSD.address,
    })
  ).waitReceipt();

  // deploy create2 factory
  console.log("Deploy CREATE2 factory");
  const provider = hre.celo.ethersProvider;
  const wallet = new CeloWallet(deployerKey, provider);
  const tx = await (
    await wallet.sendTransaction({
      from: deployerAddress,
      data: factoryBytecode,
      gasLimit: 9000000,
      gasPrice: 10 ** 9,
      feeCurrency: cUSD.address,
    })
  ).wait();
  console.log("Create2 deployer factory:", tx);
};
