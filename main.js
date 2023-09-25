const readline = require('readline');
const ethers = require('ethers');
const path = require('path');
const getInput = require(path.join(__dirname, 'utils.js'));
const AccountsMain = require(path.join(__dirname,'scriptAccounts.js'));
const AdminMain = require(path.join(__dirname,'scriptAdmins.js'));
const NodesMain = require(path.join(__dirname,'scriptNodes.js'));
async function getData(){
    console.log("\n" +
        "  _____                    _         _             _                   _____           _       _   \n" +
        " |  __ \\                  (_)       (_)           (_)                 / ____|         (_)     | |  \n" +
        " | |__) |__ _ __ _ __ ___  _ ___ ___ _  ___  _ __  _ _ __   __ _     | (___   ___ _ __ _ _ __ | |_ \n" +
        " |  ___/ _ \\ '__| '_ ` _ \\| / __/ __| |/ _ \\| '_ \\| | '_ \\ / _` |     \\___ \\ / __| '__| | '_ \\| __|\n" +
        " | |  |  __/ |  | | | | | | \\__ \\__ \\ | (_) | | | | | | | | (_| |     ____) | (__| |  | | |_) | |_ \n" +
        " |_|   \\___|_|  |_| |_| |_|_|___/___/_|\\___/|_| |_|_|_| |_|\\__, |    |_____/ \\___|_|  |_| .__/ \\__|\n" +
        "                                                            __/ |                       | |        \n" +
        "                                                           |___/                        |_|        \n");
    console.log("WELCOME TO THE PERMISSIONING SCRIPT");
    console.log("First, enter the following data: ");
    let ip_address = await getInput("Network IP and Port (HTTP://IP:PORT): ");
    let private_key = await getInput("Your private key: ");

    main(ip_address, private_key);
}
async function main(ip_address, private_key){

    const provider = new ethers.providers.JsonRpcProvider(ip_address);
    try {
        const network = await provider.getNetwork();
        console.log(`Connected to network: ${network.name}`);
        const wallet = new ethers.Wallet(private_key, provider);
        let choice = 0;

        while (choice != 1 || choice != 2 || choice != 3 || choice != 4){
            console.log("Enter a function: ");
            console.log("1 - Admin Contract Functions");
            console.log("2 - Account Functions");
            console.log("3 - Node Functions");
            console.log("4 - Exit")
            choice = await getInput("Enter your choice:");

            if (choice == 1){
                await AdminMain(wallet);
            }

            if (choice == 2){
                await AccountsMain(wallet);
            }

            if (choice == 3){
                await NodesMain(wallet);
            }

            if (choice == 4){
                console.log("Exiting.");
                break;
            }
        }
    }catch (error) {
        console.error('Error:', error);
    }



}

getData();
