const { keccak256, toUtf8Bytes } = require('ethers');
const { ACCOUNT_RULES_V2_ABI, GOVERNANCE_ABI, ORGANIZATION_ABI, NODE_RULES_V2_ABI } = require('./abis');

// ANSI color codes
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function listaAll() {
    const ABIs = [ACCOUNT_RULES_V2_ABI, GOVERNANCE_ABI, ORGANIZATION_ABI, NODE_RULES_V2_ABI];
    const ABI_NAMES = ['ACCOUNT_RULES_V2_ABI', 'GOVERNANCE_ABI', 'ORGANIZATION_ABI', 'NODE_RULES_V2_ABI'];

    for (let i = 0; i < ABIs.length; i++) {
        const abi = ABIs[i];
        const abiName = ABI_NAMES[i];

        // Print ABI name in yellow
        console.log(`${YELLOW}ABI: ${abiName}${RESET}`);

        // Filtra apenas as definições de erro
        const errors = abi.filter(item => item.startsWith('error '));

        if (errors.length === 0) {
            console.log("Nenhum erro encontrado nesta ABI\n");
            continue;
        }

        for (const errorDef of errors) {
            // Extrai nome e tipos dos parâmetros
            const match = errorDef.match(/^error\s+(\w+)\((.*)\)$/);
            if (!match) continue;

            const name = match[1];
            const params = match[2]
                .split(',')
                .map(p => p.trim().split(' ')[0]) // pega só o tipo
                .filter(Boolean)
                .join(',');

            const signature = `${name}(${params})`;
            const hash = keccak256(toUtf8Bytes(signature));
            const selector = hash.slice(0, 10);

            console.log(`signature: '${signature}'`);
            console.log(`selector: '${selector}'`);
            console.log(); // Linha vazia para melhor formatação
        }

        console.log(); // Linha vazia extra entre ABIs
    }
}

listaAll();