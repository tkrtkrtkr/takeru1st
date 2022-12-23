import { ethers } from "hardhat";

async function main() {
	const [owner] = await ethers.getSigners();

	const tx = await owner.sendTransaction({
		to: "0x...", // ここをさっき作った Metamask の自分のアドレスにする
		value: ethers.utils.parseEther("100.0")
	});

	await tx.wait().then(() => {
		console.log("100.0 ETH has been sent.");
	}).catch(e => console.error(e))
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
