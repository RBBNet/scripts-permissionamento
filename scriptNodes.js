const path = require('path');
const fs = require('fs');
const ethers = require('ethers');
const NodeRulesJSON = require(path.join(__dirname, 'src/chain/abis/NodeRules.json'));
const NodeIngressJSON = require(path.join(__dirname, 'src/chain/abis/NodeIngress.json'));
const key = require(path.join(__dirname, 'keypath.json'));
const ABI = NodeRulesJSON.abi;
const NodeABI = NodeIngressJSON.abi;
let ingressAddress = "0x0000000000000000000000000000000000009999"
async function main() {
    console.log("\n" +
        "  _   _           _                 _____           _       _   \n" +
        " | \\ | |         | |               / ____|         (_)     | |  \n" +
        " |  \\| | ___   __| | ___  ___     | (___   ___ _ __ _ _ __ | |_ \n" +
        " | . ` |/ _ \\ / _` |/ _ \\/ __|     \\___ \\ / __| '__| | '_ \\| __|\n" +
        " | |\\  | (_) | (_| |  __/\\__ \\     ____) | (__| |  | | |_) | |_ \n" +
        " |_| \\_|\\___/ \\__,_|\\___||___/    |_____/ \\___|_|  |_| .__/ \\__|\n" +
        "                                                     | |        \n" +
        "                                                     |_|        \n");
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
        let enodeHigh = process.argv[4];
        let enodeLow = process.argv[5];
        let nodeType = process.argv[6];
        let name = process.argv[7];
        let organization = process.argv[8];
        let result;

        const provider = new ethers.providers.JsonRpcProvider(ip_address);
        try {
            const network = await provider.getNetwork();
            console.log(`Connected to network: ${network.name}`);
            const wallet = new ethers.Wallet(private_key, provider);
            const NodeIngress = new ethers.Contract(ingressAddress, NodeABI, wallet);
            let rules = await NodeIngress.RULES_CONTRACT();
            let contractAddress = await NodeIngress.getContractAddress(rules);
            const contract = new ethers.Contract(contractAddress, ABI, wallet);

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


            switch (choice){
                case '1':
                    await handleEvent(
                        contract,
                        "NodeAdded",
                        () => contract.addEnode(enodeHigh, enodeLow,nodeType,'0x000000000000', name, organization)
                    );
                    break;

                case '2':
                    await handleEvent(
                        contract,
                        "NodeRemoved",
                        () => contract.removeEnode(enodeHigh, enodeLow)
                    );

                    break;

                case '3':
                    let sizeDecimal = ethers.BigNumber.from(await contract.getSize()).toNumber()
                    for (let i = 0; i < sizeDecimal; i++){
                        result = await contract.getByIndex(i);
                        console.log(result);
                    }
                    break;
                default:
                    console.log("Command not found: " + choice);
                    break;
            }
        }catch (error) {
            console.log("Sorry, there was an error: " + error.reason);
            if (error.reason === "invalid hexlify value"){
                console.log("Check your private key or the enodeHigh/Low passed as parameters. They might be wrong.");
            }
        }

    });


}

main();
