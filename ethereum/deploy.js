
// conntract address new - 0xeDd10Bf29f51b95A42dA4a8EEB8D2b7203099E48

const HDWalletProvider = require("@truffle/hdwallet-provider");

const Web3 = require("web3");

const mnemonicPhrase =
  "frown assist canal sphere expose chat repair they hat agent above stool";

const compiledGenerator = require("../ethereum/build/FakeProductDetector.json");

let provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase,
  },
  providerOrUrl:
    "wss://rinkeby.infura.io/ws/v3/533d1c833623412aa54f7dab02aefc89",
});

const web3 = new Web3(provider);
 
const deploy = async () => {
  const accounts = await new web3.eth.getAccounts();
  console.log("Attempting to deploy contract from ", accounts[0]);
  const result = await new web3.eth.Contract(
    JSON.parse(compiledGenerator.interface)
  )
    .deploy({ data: compiledGenerator.bytecode })
    .send({ from: accounts[0] });
  console.log("Contract deployed to ", result.options.address);
};
deploy();