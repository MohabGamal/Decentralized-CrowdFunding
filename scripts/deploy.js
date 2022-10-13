/** @format */

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${owner.address}`);
  const balance = await owner.getBalance();
  console.log(`Account balance: ${balance.toString()}`);

  CrowdCharity = await ethers.getContractFactory("CrowdCharity");
  crowdcharity = await CrowdCharity.deploy();
  console.log(`CrowdCharity address: ${crowdcharity.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
