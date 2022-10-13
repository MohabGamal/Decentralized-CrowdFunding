/** @format */

const { expect } = require("chai");

describe("ifelse", () => {
  let IfElse;
  let ifelse;
  beforeEach(async () => {
    IfElse = await ethers.getContractFactory("IfElse");
    ifelse = await IfElse.deploy();
  });
  it("returns 0 if less then 10", async () => {
    expect(await ifelse.foo(2)).to.equal(0);
  });

  it("returns 1 if more then 10 and less then 20", async () => {
    expect(await ifelse.foo(15)).to.equal(1);
  });

  it("returns 2 if more 20", async () => {
    expect(await ifelse.foo(25)).to.equal(2);
  });

  it("returns 1 if less then 10", async () => {
    expect(await ifelse.ternary(3)).to.equal(1);
  });
  it("returns 2 if more then 10", async () => {
    expect(await ifelse.ternary(11)).to.equal(2);
  });

  it("returns 2 if equal 10", async () => {
    expect(await ifelse.ternary(10)).to.equal(2);
  });
});
