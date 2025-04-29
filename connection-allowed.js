const path = require('path');
const ethers = require('ethers');
const { setup, getParameter, diagnostics, getSigner } = require('./util.js');
const { NODE_RULES_V2_ABI } = require('./constants.js');

const ZEROED_BYTES_16 = '0x00000000000000000000000000000000';
const CONNECTION_ALLOWED = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

async function run() {
    await diagnostics();
    const nodeRulesV2Address = getParameter('NODE_RULES_V2_ADDRESS');
    console.log(`NodeRulesV2Impl: ${nodeRulesV2Address}\n`);
    const nodesContract = new ethers.Contract(nodeRulesV2Address, NODE_RULES_V2_ABI, getSigner());

    const numArgs = process.argv.length;
    if(numArgs != 4) {
        console.log(`Utilizar sintaxe: node ${path.basename(__filename)} <enodeHigh> <enodeLow>`);
        process.exit(1);
    }
    const enodeHigh = process.argv[2];
    const enodeLow = process.argv[3];

    console.log('==================================================');
    try {
        const result = await nodesContract.connectionAllowed(enodeHigh, enodeLow, ZEROED_BYTES_16, 0, enodeHigh, enodeLow, ZEROED_BYTES_16, 0);
        const allowed = (result == CONNECTION_ALLOWED);
        console.log(`connectionAllowed(${enodeHigh}, ${enodeLow}, ${ZEROED_BYTES_16}, 0, ${enodeHigh}, ${enodeLow}, ${ZEROED_BYTES_16}, 0) - ${allowed}`);
    }
    catch(error) {
        console.log(`Erro na verificação de conectividade do nó ${enodeHigh} ${enodeLow}: ${error.message}`);
    }
}

setup();
run();
