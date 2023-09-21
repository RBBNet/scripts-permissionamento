const path = require('path');
const ethers = require('ethers');
const NodeRulesJSON = require(path.join(__dirname, 'src/chain/abis/NodeRules.json'));
const getInput = require(path.join(__dirname, 'utils.js'));
const ABI = NodeRulesJSON.abi;
async function NodesMain(wallet) {
    console.log("\n" +
        "  _   _           _                 _____           _       _   \n" +
        " | \\ | |         | |               / ____|         (_)     | |  \n" +
        " |  \\| | ___   __| | ___  ___     | (___   ___ _ __ _ _ __ | |_ \n" +
        " | . ` |/ _ \\ / _` |/ _ \\/ __|     \\___ \\ / __| '__| | '_ \\| __|\n" +
        " | |\\  | (_) | (_| |  __/\\__ \\     ____) | (__| |  | | |_) | |_ \n" +
        " |_| \\_|\\___/ \\__,_|\\___||___/    |_____/ \\___|_|  |_| .__/ \\__|\n" +
        "                                                     | |        \n" +
        "                                                     |_|        \n");
    let contractAddress = await getInput("Enter contract address: ");
    const contract = new ethers.Contract(contractAddress, ABI, wallet);
    let enodeHigh, enodeLow;
    let choice = 0;
    while (choice != 1 || choice != 2 || choice != 3 || choice != 4){
        console.log("1 - ADD ENODE\n2 - REMOVE ENODE\n3 - VIEW ENODE\n4 - EXIT");
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
        } if (choice == 4){
            console.log("Exiting nodes script.")
            break;
        }

        else {
            console.log("Invalid command.");
        }
    }

}

module.exports = NodesMain;