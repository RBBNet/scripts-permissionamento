const fs = require('fs');
const readline = require('readline');
const ethers = require('ethers');
const AdminJSON = require("../src/chain/abis/Admin.json"); //Mudar para endereço genérico
const config = require("../scripts/config.json"); //config é um arquivo com a chave privada
const AdminABI = AdminJSON.abi;
const networkId = config.networkID;
const privateKey = config.privateKey;
const contractAddress = AdminJSON.networks[networkId].address;

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545'); // URL do provedor JSON-RPC
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, AdminABI, wallet);

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
    let choice = 0;
    let address;
    while (choice != 1 || choice != 2 || choice != 3){
        console.log("1 - ADD ADMIN\n2 - REMOVE ADMIN\n3- GET ADMINS");
        choice = await getInput('Enter your choice: ');
        if (choice == 1){
            address = await getInput('Enter the new admin address: ');
            let result = await contract.addAdmin(address);
            break;
        } if (choice == 2){
            address = await getInput('Enter the admin address to be removed: ');
            let result = await contract.removeAdmin(address);
            break;
        } if (choice == 3){
            const admins = await contract.getAdmins();
            console.log(admins);
        }


        else {
            console.log("Invalid command.");
        }
    }



    rl.close();
}

main();