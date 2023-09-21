const path = require('path');
const ethers = require('ethers');
const AccountsJSON = require(path.join(__dirname, 'src/chain/abis/AccountRules.json'));
const readline = require("readline");
const getInput = require(path.join(__dirname, 'utils.js'));
const ABI = AccountsJSON.abi;


async function AccountsMain(wallet){
    console.log("\n" +
        "                                    _             _____           _       _   \n" +
        "     /\\                            | |           / ____|         (_)     | |  \n" +
        "    /  \\   ___ ___ ___  _   _ _ __ | |_ ___     | (___   ___ _ __ _ _ __ | |_ \n" +
        "   / /\\ \\ / __/ __/ _ \\| | | | '_ \\| __/ __|     \\___ \\ / __| '__| | '_ \\| __|\n" +
        "  / ____ \\ (_| (_| (_) | |_| | | | | |_\\__ \\     ____) | (__| |  | | |_) | |_ \n" +
        " /_/    \\_\\___\\___\\___/ \\__,_|_| |_|\\__|___/    |_____/ \\___|_|  |_| .__/ \\__|\n" +
        "                                                                   | |        \n" +
        "                                                                   |_|        \n");
    let contractAddress = await getInput("Enter contract address: ");
    const contract = new ethers.Contract(contractAddress, ABI, wallet);
    let choice = 0;
    let address;
    while (choice != 1 || choice != 2 || choice != 3 || choice != 4){
        console.log("1 - ADD ACCOUNT\n2 - REMOVE ACCOUNT\n3- GET ACCOUNTS LIST\n4 - EXIT");
        choice = await getInput('Enter your choice: ');
        if (choice == 1){
            address = await getInput('Enter the new account address: ');
            let result = await contract.addAccount(address);
            break;
        } if (choice == 2){
            address = await getInput('Enter the account address to be removed: ');
            let result = await contract.removeAccount(address);
            break;
        } if (choice == 3){
            const accounts = await contract.getAccounts();
            console.log(accounts);
            break;
        } if (choice == 4){
            console.log("Exiting accounts script.")
            break;
        }
    }
}

module.exports = AccountsMain;
