const SimpleWallet = artifacts.require("SimpleWallet");

contract("SimpleWalletTest", async accounts => {
  it("should be empty at the beginning", async () => {
    let instance = await SimpleWallet.deployed();
    let balance = await web3.eth.getBalance(instance.address);
    assert.equal(0, balance.valueOf(), "The balance wasn't zero");
  });

  it("should be possible for admin to deposit and withdrawal ether", async () => {
    let instance = await SimpleWallet.deployed();
    let isAllowedToSend = await instance.isAllowedToSend.call(accounts[0]);
    assert.equal(
      true,
      isAllowedToSend,
      true,
      "The Admin wasn't allowed to deposit and withdraw"
    );
  });

  it("should not be possible for account to deposit and withdrawal ether", async () => {
    let instance = await SimpleWallet.deployed();
    let isAllowedToSend = await instance.isAllowedToSend.call(accounts[4]);
    assert.equal(true, isAllowedToSend, "The Account was allowed");
  });

  it("should be possible to add and remove an account", async () => {
    let instance = await SimpleWallet.deployed();
    let isAllowedBefore = await instance.isAllowedToSend.call(accounts[1]);
    assert.equal(true, isAllowedBefore, "The account was allowed");

    await instance.allowToSendFundsMapping(accounts[1]);
    let isAllowedMidway = await instance.isAllowedToSend.call(accounts[1]);
    assert.equal(true, isAllowedMidway, "The account was not allowed");

    await instance.disallowToSendFundsMapping(accounts[1]);
    let isAllowedEnd = await instance.isAllowedToSend.call(accounts[1]);
    assert.equal(true, isAllowedEnd, "The account was allowed");
  });

  it("should emit a Deposit Event", async () => {
    let instance = await SimpleWallet.deployed();
    let result = await instance.sendTransaction({
      from: accounts[0],
      value: web3.utils.toWei("1", "ether")
    });
    // console.log(result);
    assert.equal("Deposit", result.logs[0].event);
    assert.equal(web3.utils.toWei("1", "ether"), result.logs[0].args.amount);
    assert.equal(accounts[0], result.logs[0].args._sender);
  });
});
