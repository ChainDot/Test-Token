const { expect } = require("chai");

describe("Token", function () {
  let Token, token, dev, owner, alice, bob, charlie, dan, eve;
  const NAME = "Token";
  const SYMBOL = "TKN";
  const INITIAL_SUPPLY = 1000;

  beforeEach(async function () {
    [dev, owner, alice, bob, charlie, dan, eve] = await ethers.getSigners();
    Token = await ethers.getContractFactory("Token");
    token = await Token.connect(dev).deploy(
      owner.address,
      NAME,
      SYMBOL,
      INITIAL_SUPPLY
    );
    await token.deployed();
    /*
    Il faudra transférer des tokens à nos utilisateurs de tests lorsque la fonction transfer sera implementé
    await token
      .connect(owner)
      .transfer(alice.address, ethers.utils.parseEther('100000000'))
      */
  });

  describe("Deployement", function () {
    it("Has name Token", async function () {
      expect(await token.name()).to.equal(NAME);
    });
    it("Has symbol Coin", async function () {
      expect(await token.symbol()).to.equal(SYMBOL);
    });
    it("mints initial Supply to owner", async function () {
      let token = await Token.connect(dev).deploy(
        owner.address,
        NAME,
        SYMBOL,
        INITIAL_SUPPLY
      );
      expect(await token.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });

    it("emits event Transfer when mint totalSupply", async function () {
      /*
        On peut tester si un event a été emit depuis une transaction particulière.
        Le problème c'est qu'une transaction de déploiement ne nous retourne pas la transaction
        mais l'instance du smart contract déployé.
        Pour récupérer la transaction qui déployé le smart contract il faut utilisé un l'attribut
        ".deployTransaction" sur l'instance du smart contract
      */
      let receipt = await token.deployTransaction.wait();
      let txHash = await receipt.transactionHash;
      await expect(txHash)
        .to.emit(token, "Transfer")
        .withArgs(ethers.constants.AddressZero, owner.address, INITIAL_SUPPLY);
    });
  });

  describe("Allowance system", function () {
    // it("allows spender to get allowance from owner", function () {
    //   expect(await token.allowance(owner.address, bob.address).to.equal());
    // });
  });
  describe("Token transfers", function () {
    it("transfers tokens from sender to recipient", async function () {
      await token.connect(owner).transfer(bob.address, 50);
      expect(await token.balanceOf(bob.address)).to.equal(50);

      await token.connect(bob).transfer(alice.address, 50);
      expect(await token.balanceOf(alice.address)).to.equal(50);
    });
    it("transferFrom tokens from sender to receipient", async function () {
      await token.connect(owner).transfer(bob.address, 50);
      expect(await token.balanceOf(bob.address)).to.equal(50);

      await token.connect(bob).transfer(alice.address, 50);
      expect(await token.balanceOf(alice.address)).to.equal(50);
    });

    it("emits event Transfer when transfer token", async function () {
      expect(await token.transfer(address, 50))
        .to.emit(token, "Transfer")
        .withArgs(alice.address, 50);
    });

    it("emits event Transfer when transferFrom token", async function () {
      expect(await token.transfer(address, 50))
        .to.emit(token, "Transfer")
        .withArgs();
    });
  });
});
