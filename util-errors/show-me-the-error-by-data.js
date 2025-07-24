const { keccak256, toUtf8Bytes } = require('ethers');
const { ACCOUNT_RULES_V2_ABI, GOVERNANCE_ABI, ORGANIZATION_ABI, NODE_RULES_V2_ABI } = require('./abis');

let catalogEerrorsKeccak256 = {};

function showMeTheErrorByData() {
    const data = process.argv[2];
    criticaEntrada(data);
    const seletor = data.slice(0, 10);
    criaCatalogoEerrorsKeccak256();
    const assinaturasErro = catalogEerrorsKeccak256[seletor];
    if (!assinaturasErro || assinaturasErro.length === 0) {
        console.error("Seletor não encontrado no catálogo de erros.");
        process.exit(1);
    }

    // Get unique error details (they should be the same across ABIs)
    const errorSignature = assinaturasErro[0][1];
    const errorDescription = assinaturasErro[0][2];

    // Create a list of ABI names where this error was found
    const abiNames = assinaturasErro.map(entry => entry[0]);

    console.log(
        "ABIs onde o erro foi encontrado: " + abiNames.join(", ") + "\n" +
        "Erro: " + errorSignature + "\n" +
        "Descrição: " + errorDescription + "\n" +
        "Seletor: " + seletor
    );
}

const criaCatalogoEerrorsKeccak256 = () => {
    const ABIs = [ACCOUNT_RULES_V2_ABI, GOVERNANCE_ABI, ORGANIZATION_ABI, NODE_RULES_V2_ABI];
    const ABI_NAMES = ['ACCOUNT_RULES_V2_ABI', 'GOVERNANCE_ABI', 'ORGANIZATION_ABI', 'NODE_RULES_V2_ABI'];
    for (const key in ABIs) {
        getErrorSignaturesAndKeccak(ABIs[key], ABI_NAMES[key]);
    }
};

const getErrorSignaturesAndKeccak = (abi, abiname) => {
    abi
        .filter(item => item.startsWith('error '))
        .map(item => {
            // Extrai nome e tipos dos parâmetros
            const match = item.match(/^error\s+(\w+)\((.*)\)$/);
            if (!match) return null;
            const name = match[1];
            const params = match[2]
                .split(',')
                .map(p => p.trim().split(' ')[0]) // pega só o tipo
                .filter(Boolean)
                .join(',');
            const signature = `${name}(${params})`;
            const hash = keccak256(toUtf8Bytes(signature));
            const selector = hash.slice(0, 10);

            // Initialize array if it doesn't exist
            if (!catalogEerrorsKeccak256[selector]) {
                catalogEerrorsKeccak256[selector] = [];
            }

            // Add entry to array instead of overwriting
            catalogEerrorsKeccak256[selector].push([abiname, signature, item, selector]);
        })
        .filter(Boolean);
}

const criticaEntrada = () => {
    // Unchanged code...
    if (process.argv.length !== 3) {
        console.log("Informe o 'data' ou 'seletor' retornado na estrutura error.");
        console.log("O seletor são os primeiros 10 caracteres do 'data' retornado na estrutura de erro.");
        console.log("Exemplo de seletor: 0x36f81984")
        console.log("A estrutura de erro retornada geralmente tem um code, uma message e um data.");
        console.error('Uso: node show-me-the-error-by-data.js <data> ou <seletor>');
        process.exit(1);
    }
    const dataOuSeletor = process.argv[2]
    if (!dataOuSeletor.startsWith('0x')) {
        console.error("O argumento 'data' ou 'seletor' deve começar com '0x'.");
        process.exit(1);
    }
    if (dataOuSeletor.length < 10) {
        console.error("O 'data' ou 'seletor' deve ter pelo menos 10 caracteres (incluindo '0x').");
        process.exit(1);
    }
};

showMeTheErrorByData();

module.exports = { recuperaAssinaturErroNasABIs: showMeTheErrorByData };