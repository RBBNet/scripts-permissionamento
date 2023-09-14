const fs = require('fs');
const readline = require('readline');
const ethers = require('ethers');
const NodeRulesJSON = require("../src/chain/abis/NodeRules.json"); //Mudar para endereço genérico
const config = require("../scripts/config.json"); //config é um arquivo com a chave privada
const NodeRulesABI = NodeRulesJSON.abi;
const networkId = config.networkID;
const privateKey = config.privateKey;
const contractAddress = NodeRulesJSON.networks[networkId].address;

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545'); // URL do provedor JSON-RPC
const wallet = new ethers.Wallet(privateKey, provider);




const contract = new ethers.Contract(contractAddress, NodeRulesABI, wallet);


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    let enodeHigh, enodeLow;
    let choice = 0;
    while (choice != 1 || choice != 2){
        console.log("1 - ADD ENODE\n2 - REMOVE ENODE\n3 - VIEW ENODE");
        choice = await getInput('Enter your choice: ');
        if (choice == 1){
            enodeHigh= await getInput('Enter enodeHigh: ');
            enodeLow = await getInput('Enter enodeLow: ');
            const nodeType = await getInput('Enter nodeType: ');
            const name = await getInput('Enter name: ');
            const organization = await getInput('Enter organization: ');
            let result = contract.addEnode(enodeHigh, enodeLow,nodeType,0x39713879796b, name, organization);
            //esse 0x39713879796b é um placeholder
            break;
        } if (choice == 2){
            enodeHigh = await getInput('Enter enodeHigh: ');
            enodeLow = await getInput('Enter enodeLow: ');
            let result = contract.removeEnode(enodeHigh, enodeLow);
            break;
        } if (choice == 3){
            let index = await getInput("Enter enode index: ");
            let result = contract.getByIndex(index);
            console.log(result);
        }

        else {
            console.log("Invalid command.");
        }
    }



    rl.close();
}

main();