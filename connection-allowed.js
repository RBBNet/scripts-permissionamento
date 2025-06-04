const path = require('path');
const ethers = require('ethers');
const { setup, getParameter, diagnostics, getSigner } = require('./util.js');
const { NODE_RULES_V2_ABI } = require('./constants.js');

const ZEROED_BYTES_16 = '0x00000000000000000000000000000000';
const CONNECTION_ALLOWED = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

async function run() {
    await setup();
    await diagnostics();
    const nodeRulesV2Address = getParameter('NODE_RULES_V2_ADDRESS');
    console.log(`NodeRulesV2Impl: ${nodeRulesV2Address}\n`);
    const nodesContract = new ethers.Contract(nodeRulesV2Address, NODE_RULES_V2_ABI, getSigner());

    const numArgs = process.argv.length;
    if(numArgs != 4 && numArgs != 6) {
        console.log(`Utilizar sintaxe: node ${path.basename(__filename)} <sourceEnodeHigh> <sourceEnodeLow> {destEnodeHigh} {destEnodeLow}`);
        console.log(`Caso os parâmtros {destEnodeHigh} {destEnodeLow} não sejam informados, eles serão preenchidos com os mesmos valores dos parâmetros <sourceEnodeHigh> <sourceEnodeLow>`);
        process.exit(1);
    }
    const sourceEnodeHigh = process.argv[2];
    const sourceEnodeLow = process.argv[3];
    const destEnodeHigh = numArgs == 6 ? process.argv[4] : sourceEnodeHigh;
    const destEnodeLow = numArgs == 6 ? process.argv[5] : sourceEnodeLow;

    console.log('==================================================');
    try {
        const result = await nodesContract.connectionAllowed(sourceEnodeHigh, sourceEnodeLow, ZEROED_BYTES_16, 0, destEnodeHigh, destEnodeLow, ZEROED_BYTES_16, 0);
        const allowed = (result == CONNECTION_ALLOWED);
        console.log(`connectionAllowed(${sourceEnodeHigh}, ${sourceEnodeLow}, ${ZEROED_BYTES_16}, 0, ${destEnodeHigh}, ${destEnodeLow}, ${ZEROED_BYTES_16}, 0) - ${allowed}`);
    }
    catch(error) {
        console.log(`Erro na verificação de conectividade: ${error.message}`);
    }
}

run();
