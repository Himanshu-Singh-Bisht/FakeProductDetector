import web3 from'./web3';
import FakeProductDetector from '../ethereum/build/FakeProductDetector.json';

const instance = 
    new web3.eth.Contract(
        JSON.parse(FakeProductDetector.interface),
        "0xeDd10Bf29f51b95A42dA4a8EEB8D2b7203099E48");
    

export default instance;