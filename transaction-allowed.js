const path = require('path');
const ethers = require('ethers');
const { setup, getParameter, diagnostics, getSigner } = require('./util.js');
const { ACCOUNT_RULES_V2_ABI } = require('./constants.js');

const ZEROED_BYTES = '0x00';
const NON_ZEROED_ADDRESS = '0x0000000000000000000000000000000000000001';

async function run() {
    await diagnostics();
    const accountRulesV2Address = getParameter('ACCOUNT_RULES_V2_ADDRESS');
    console.log(`AccountRulesV2Impl: ${accountRulesV2Address}\n`);
    const accountsContract = new ethers.Contract(accountRulesV2Address, ACCOUNT_RULES_V2_ABI, getSigner());
    
    const numArgs = process.argv.length;
    if(numArgs < 3 || numArgs > 4) {
        console.log(`Utilizar sintaxe: node ${path.basename(__filename)} <account> {target}`);
        console.log(`Caso o parâmtro {target} não seja informado, será utilizado o endereço ${NON_ZEROED_ADDRESS}`);
        process.exit(1);
    }
    const account = process.argv[2];
    const target = numArgs > 3 ? process.argv[3] : NON_ZEROED_ADDRESS;

    console.log('==================================================');
    try {
        const allowed = await accountsContract.transactionAllowed(account, target, 0, 0, 0, ZEROED_BYTES);
        console.log(`transactionAllowed(${account}, ${target}, 0, 0, 0, ${ZEROED_BYTES}) - ${allowed}`);
    }
    catch(error) {
        console.log(`Erro na verificação de acesso da conta ${account}: ${error.message}`);
    }
}

setup();
run();
