const path = require('path');
const fs = require('fs');
const ethers = require('ethers');
const AccountsJSON = require(path.join(__dirname, 'src/chain/abis/AccountRules.json'));
const key = require(path.join(__dirname, 'keypath.json'));
const ABI = AccountsJSON.abi;
async function main(){
    console.log("\n" +
        "                                    _             _____           _       _   \n" +
        "     /\\                            | |           / ____|         (_)     | |  \n" +
        "    /  \\   ___ ___ ___  _   _ _ __ | |_ ___     | (___   ___ _ __ _ _ __ | |_ \n" +
        "   / /\\ \\ / __/ __/ _ \\| | | | '_ \\| __/ __|     \\___ \\ / __| '__| | '_ \\| __|\n" +
        "  / ____ \\ (_| (_| (_) | |_| | | | | |_\\__ \\     ____) | (__| |  | | |_) | |_ \n" +
        " /_/    \\_\\___\\___\\___/ \\__,_|_| |_|\\__|___/    |_____/ \\___|_|  |_| .__/ \\__|\n" +
        "                                                                   | |        \n" +
        "                                                                   |_|        \n");
    const keyFilePath = key.path;
    let private_key;
    fs.readFile(keyFilePath, 'utf8', async (err, keyContent) => {
        if (err) {
            console.error(`There was an error reading the private key archive: ${err}`);
            return;
        }

        private_key = keyContent;

        let ip_address = process.argv[2];
        let contractAddress = process.argv[3];
        let choice = process.argv[4];
        let address = process.argv[5];
        let result;

        const provider = new ethers.providers.JsonRpcProvider(ip_address);
        try {
            const network = await provider.getNetwork();
            console.log(`Connected to network: ${network.name}`);
            const wallet = new ethers.Wallet(private_key, provider);
            const contract = new ethers.Contract(contractAddress, ABI, wallet);
            let accounts;
            switch (choice){
                case '1':
                    result = await contract.addAccount(address);
                    break;
                case '2':
                    result = await contract.removeAccount(address);
                    break;
                case '3':
                    accounts = await contract.getAccounts();
                    console.log(accounts);
                    break;
                default:
                    console.log("Command not found.");
                    break;
            }
        }catch (error) {
            console.error("Sorry, there was an error:", error.reason +". Please try again.");
        }

    });

}



main();






