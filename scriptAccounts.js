const path = require('path');
const fs = require('fs');
const ethers = require('ethers');
const IngressJSON = require(path.join(__dirname, 'src/chain/abis/AccountIngress.json'));
const AccountsJSON = require(path.join(__dirname, 'src/chain/abis/AccountRules.json'));
const key = require(path.join(__dirname, 'keypath.json'));
const ABI = AccountsJSON.abi;
const IngressABI = IngressJSON.abi;
let ingressAddress = "0x0000000000000000000000000000000000008888";
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
        let choice = process.argv[3];
        let address = process.argv[4];
        let result;

        const provider = new ethers.providers.JsonRpcProvider(ip_address);
        try {
            const network = await provider.getNetwork();
            console.log(`Connected to network: ${network.name}`);
            const wallet = new ethers.Wallet(private_key, provider);
            const accountIngress = new ethers.Contract(ingressAddress, IngressABI, wallet);
            let rules = await accountIngress.RULES_CONTRACT();
            let contractAddress = await accountIngress.getContractAddress(rules);
            const contract = new ethers.Contract(contractAddress, ABI, wallet);
            let accounts;
            async function handleEvent(contract, eventName, action, ...args) {

                const result = await action();

                const transferEvent = await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error(`Timeout waiting for event: ${eventName}`));
                        }, 60000); // 60 seconds timeout

                        contract.once(eventName, (...eventArgs) => {
                            clearTimeout(timeout);
                            resolve(eventArgs.length > 1 ? eventArgs : eventArgs[0]);
                        });
                    });

                    if (transferEvent[0]) {
                        console.log("Success!");
                    } else {
                        console.log(`Sorry, there was an error and the ${eventName} event did not happen as expected.`);
                    }

            }


            switch (choice) {
                case '1':
                    await handleEvent(
                        contract,
                        "AccountAdded",
                        () => contract.addAccount(address)
                    );
                    break;
                case '2':
                    await handleEvent(
                        contract,
                        "AccountRemoved",
                        () => contract.removeAccount(address)
                    );
                    break;
                case '3':
                    accounts = await contract.getAccounts();
                    console.log(accounts);
                    break;
                default:
                    console.log("Command not found: " + choice);
                    break;
            }

        }catch (error) {
            console.log("Sorry, there was an error: " + error.reason + ".");
            if (error.reason === "invalid hexlify value"){
                console.log("Check your private key or accounts passed as parameters. They must have exactly 64 characters.");
            } else if (error.reason === "could not detect network"){
                console.log("Check the network address passed as a parameter.");

            }

        }
    });

}



main();






