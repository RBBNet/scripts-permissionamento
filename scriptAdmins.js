const path = require('path');
const ethers = require('ethers');
const AdminJSON = require(path.join(__dirname, 'src/chain/abis/Admin.json'));
const readline = require("readline");
const getInput = require(path.join(__dirname, 'utils.js'));
const ABI = AdminJSON.abi;

async function AdminMain(wallet){
    console.log("\n" +
        "              _           _             _____           _       _   \n" +
        "     /\\      | |         (_)           / ____|         (_)     | |  \n" +
        "    /  \\   __| |_ __ ___  _ _ __      | (___   ___ _ __ _ _ __ | |_ \n" +
        "   / /\\ \\ / _` | '_ ` _ \\| | '_ \\      \\___ \\ / __| '__| | '_ \\| __|\n" +
        "  / ____ \\ (_| | | | | | | | | | |     ____) | (__| |  | | |_) | |_ \n" +
        " /_/    \\_\\__,_|_| |_| |_|_|_| |_|    |_____/ \\___|_|  |_| .__/ \\__|\n" +
        "                                                         | |        \n" +
        "                                                         |_|        \n");
    let contractAddress = await getInput("Enter contract address: ");
    const contract = new ethers.Contract(contractAddress, ABI, wallet);
    let choice = 0;
    let address;
    while (choice != 1 || choice != 2 || choice != 3 || choice != 4){
        console.log("1 - ADD ADMIN\n2 - REMOVE ADMIN\n3- GET ADMIN LIST\n4 - EXIT");
        choice = await getInput('Enter your choice: ');
        if (choice == 1){
            address = await getInput('Enter the admin address to be added: ');
            let result = await contract.addAdmin(address);
            break;
        } if (choice == 2){
            address = await getInput('Enter the admin address to be removed: ');
            let result = await contract.removeAdmin(address);
            break;
        } if (choice == 3){
            const admins = await contract.getAdmins();
            console.log(admins);
            break;
        } if (choice == 4){
            console.log("Exiting admins script.")
            break;
        }
    }
}

module.exports = AdminMain;

