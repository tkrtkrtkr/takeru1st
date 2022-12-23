import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");

	// ここから修正
  const crowdfunding = await Crowdfunding.deploy(
    "Test Funds", // title: タイトル
    "Test Desc", // description: 説明
    ethers.utils.parseEther("0.005"), // target: 目標金額
    "0x..." // toAddr: 回収資金の送金先アドレス
  );
	// ここまで修正

  console.log(`The contract was successfully deployed to ${crowdfunding.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
