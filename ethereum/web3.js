import Web3 from 'web3';

let web3;
const web3Instance=async()=>{
    if (typeof window!=='undefined'&& typeof window.ethereum!=='undefined') {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (typeof window!=='undefined'&& typeof window.web3!=='undefined') {
        web3 = new Web3(window.web3.currentProvider);
    } else {
        const provider=new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/533d1c833623412aa54f7dab02aefc89');
        web3=new Web3(provider);
    };
}
web3Instance();

export default web3;