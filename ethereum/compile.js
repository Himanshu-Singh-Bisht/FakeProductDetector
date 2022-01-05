const path = require('path');
const solc = require('solc');
const fs=require('fs-extra');

const buildPath=path.resolve(__dirname,'build');
fs.removeSync(buildPath);

const detectorPath = path.resolve(__dirname,'contracts','FakeProductDetector.sol');

const source=fs.readFileSync(detectorPath,'utf8');
const output=solc.compile(source,1).contracts;

fs.ensureDirSync(buildPath);

for(let contract in output){
    fs.outputJsonSync(
        path.resolve(buildPath,contract.replace(':','')+'.json'),
        output[contract]
    );
}






// function compileContract() {
//     let fakeProductDetectorSOL = fs.readFileSync('./contracts/FakeProductDetector.sol' , 'utf8')
//     let complierInput = {
//         language: 'Solidity',
//         sources:
//         {
//             'FakeProductDetector.sol': 
//             {
//                 content: fakeProductDetectorSOL
//             }
//         },
//         settings:
//         {
//             optimizer:
//             {
//                 enabled: true
//             },
//             outputSelection:
//             {
//                 '*':{
//                     '*':['*']
//                 }
//             }
//         }
//     };
//     console.log('compiling contract');
//     let compiledContract = JSON.parse(solc.compile(JSON.stringify(complierInput)));
//     console.log('Contract Compiled');
//     for (let contractName in compiledContract.contracts['FakeProductDetector.sol']) {
//         console.log(contractName , compiledContract.contracts['FakeProductDetector.sol'][contractName].abi);      
//         let abi = compiledContract.contracts['FakeProductDetector.sol'][contractName].abi;
//         fs.writeFileSync(`./build/${contractName}_abi.json` , JSON.stringify(abi));
//         return compiledContract.contracts['FakeProductDetector.sol'][contractName];
//     }
// }





// const solc = require('solc');

// var input = {
//     language: 'Solidity',
//     sources: {
//         'hello.sol': {
//             content: 'contract hello { function f() public { } }'
//         }
//     },
//     settings: {
//         outputSelection: {
//             '*': {
//                 '*': ['*']
//             }
//         }
//     }
// };

// var output = JSON.parse(solc.compile(JSON.stringify(input)));
// console.log(output);