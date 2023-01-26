// /** @format */

// const { expect } = require("chai");

// describe("token contract", () => {
//   let Token, token, owner, addr1, addr2;

//   beforeEach(async () => {
//     Token = await ethers.getContractFactory("Token");
//     token = await Token.deploy();
//     [owner, addr1, addr2, _] = await ethers.getSigners();
//   });

//   describe("Deployment", async () => {
//     it("should set the right owner", async () => {
//       expect(await token.owner()).to.equal(owner.address);
//     });
//     it("should assign the total supply of tokens to the owner", async () => {
//       const ownerBalance = await token.balanceof(owner.address);
//       expect(await token.totalSupply()).to.equal(ownerBalance);
//     });
//   });

//   describe("Transactions", () => {
//     it("should tranfer tokens between accounts", async () => {
//       await token.transfer(addr1.address, 50);
//       const addr1Balance = await token.balanceof(addr1.address);
//       expect(addr1Balance).to.equal(50);

//       await token.connect(addr1).transfer(addr2.address, 50);
//       const addr2Balance = await token.balanceof(addr2.address);
//       expect(addr2Balance).to.equal(50);
//     });
//     it("should fail if sender doesn't have enough tokens", async () => {
//       const initialBalanceOwner = await token.balanceof(owner.address);
//       await expect(
//         token.connect(addr1).transfer(owner.address, 1)
//       ).to.be.revertedWith("Not enough tokens");

//       expect(await token.balanceof(owner.address)).to.equal(
//         initialBalanceOwner
//       );
//     });
//     it("should update balances after transfer", async () => {
//       const initialBalanceOwner = await token.balanceof(owner.address);
//       token.transfer(addr1.address, 50);
//       token.transfer(addr2.address, 100);
//       const finalBalanceOwner = await token.balanceof(owner.address);

//       expect(finalBalanceOwner).to.equal(initialBalanceOwner - 150);

//       const addr1Balance = await token.balanceof(addr1.address);
//       expect(addr1Balance).to.equal(50);

//       const addr2Balance = await token.balanceof(addr2.address);
//       expect(addr2Balance).to.equal(100);
//     });
//   });
// });
