// /** @format */

// const { expect } = require("chai");
// describe("ether walet contract", () => {
//   let EthereumWallet;
//   let ethereumwallet;
//   let owner, addr1, addr2;
//   beforeEach(async () => {
//     EthereumWallet = await ethers.getContractFactory("EthereumWallet");
//     ethereumwallet = await EthereumWallet.deploy();
//     [owner, addr1, addr2, _] = await ethers.getSigners();
//   });
//   describe("Deployment", async () => {
//     it("should set the right owner", async () => {
//       expect(await ethereumwallet.getOwner()).to.equal(owner.address);
//     });

//     describe("Trasaction", () => {
//       it("should let the owner deposit eth into the contract", async () => {
//         await ethereumwallet.connect(owner).deposit({ value: 10 });
//         let balance = await ethereumwallet.balance();
//         expect(balance).to.equal(10);
//       });
//       it("should let anyone deposit eth into the contract", async () => {
//         await ethereumwallet.connect(addr1).deposit({ value: 10 });
//         let balance = await ethereumwallet.balance();
//         expect(balance).to.equal(10);
//       });
//       it("should let the owner send eth to another one", async () => {
//         await ethereumwallet.connect(owner).deposit({ value: 10 });

//         await ethereumwallet.connect(owner).send(addr1.address, { value: 10 });
//         let balanceaddr1 = await ethereumwallet.connect(addr1).balance();
//         expect(balanceaddr1).to.equal(10);
//       });
//       it("shouldn't let anyone send eth to another one except owner", async () => {
//         await ethereumwallet.connect(owner).deposit({ value: 10 });

//         await expect(
//           ethereumwallet.connect(addr1).send(addr2.address, { value: 10 })
//         ).to.be.revertedWith("only the owner can call this function");
//       });
//       it("should let the owner withdraw", async () => {
//         await ethereumwallet.connect(owner).deposit({ value: 10 });
//         await ethereumwallet.connect(owner).withdraw(10);
//         let balance = await ethereumwallet.balance();
//         expect(balance).to.equal(0);
//       });
//       it("shouldn't let anyone other then the owner to withdraw", async () => {
//         await ethereumwallet.connect(owner).deposit({ value: 10 });
//         await expect(
//           ethereumwallet.connect(addr1).withdraw(2)
//         ).to.be.revertedWith("only the owner can call this function");
//       });
//     });
//   });
// });
