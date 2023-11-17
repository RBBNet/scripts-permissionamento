const path = require('path');
const fs = require('fs');
const ethers = require('ethers');
const AdminJSON = require(path.join(__dirname, 'src/chain/abis/Admin.json'));
const key = require(path.join(__dirname, 'keypath.json'));
const ABI = AdminJSON.abi;
const NodeIngressJSON = require(path.join(__dirname, 'src/chain/abis/NodeIngress.json'));
const NodeABI = NodeIngressJSON.abi;
let ingressAddress = "0x0000000000000000000000000000000000009999";
//pegar o admin do node
async function main() {
    console.log("\n" +
        "              _           _             _____           _       _   \n" +
        "     /\\      | |         (_)           / ____|         (_)     | |  \n" +
        "    /  \\   __| |_ __ ___  _ _ __      | (___   ___ _ __ _ _ __ | |_ \n" +
        "   / /\\ \\ / _` | '_ ` _ \\| | '_ \\      \\___ \\ / __| '__| | '_ \\| __|\n" +
        "  / ____ \\ (_| | | | | | | | | | |     ____) | (__| |  | | |_) | |_ \n" +
        " /_/    \\_\\__,_|_| |_| |_|_|_| |_|    |_____/ \\___|_|  |_| .__/ \\__|\n" +
        "                                                         | |        \n" +
        "                                                         |_|        \n");

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
            const NodeIngress = new ethers.Contract(ingressAddress, NodeABI, wallet);
            let admin = await NodeIngress.ADMIN_CONTRACT();
            let contractAddress = await NodeIngress.getContractAddress(admin);

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
                        "AdminAdded",
                        () => contract.addAdmin(address)
                    );
                    break;
                case '2':
                    await handleEvent(
                        contract,
                        "AdminRemoved",
                        () => contract.removeAdmin(address)
                    );
                    break;
                case '3':
                    const admins = await contract.getAdmins();
                    console.log(admins);
                    break;
                default:
                    console.log("Command not found: " + choice);
                    break;
            }
        }catch (error) {
            console.error("Sorry, there was an error:", error.reason +". Please try again.");
        }

    });

}



main();
