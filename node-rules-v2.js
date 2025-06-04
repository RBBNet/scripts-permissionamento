const ethers = require('ethers');
const { setup, getParameter, diagnostics, getSigner, getFunctionArgs, verifyArgsLength, getNodeType, getNodeTypeName, getBoolean, handleTx, help } = require('./util.js');
const { NODE_RULES_V2_ABI } = require('./constants.js');

const syntax = {
    'addLocalNode': 'addLocalNode <enodeHigh> <enodeLow> <nodeType> <name>',
    'deleteLocalNode': 'deleteLocalNode <enodeHigh> <enodeLow>',
    'updateLocalNode': 'updateLocalNode <enodeHigh> <enodeLow> <nodeType> <name>',
    'updateLocalNodeStatus': 'updateLocalNodeStatus <enodeHigh> <enodeLow> <active>',
    'isNodeActive': 'isNodeActive <enodeHigh> <enodeLow>',
    'getNode': 'getNode <enodeHigh> <enodeLow>',
    'getNumberOfNodes': 'getNumberOfNodes',
    'getNodes': 'getNodes <pageNumber> <pageSize>',
    'getNumberOfNodesByOrg': 'getNumberOfNodesByOrg <orgId>',
    'getNodesByOrg': 'getNodesByOrg <orgId> <pageNumber> <pageSize>',
};

const nodeRulesV2 = {
    'addLocalNode': async function (contract, func, args) {
        verifyArgsLength(4, func, args, syntax[func]);
        const enodeHigh = args[0];
        const enodeLow = args[1];
        const nodeType = getNodeType(args[2]);
        const name = args[3];
        const tx = await contract.addLocalNode(enodeHigh, enodeLow, nodeType, name);
        await handleTx(tx);
        console.log(`\nNó ${enodeHigh} ${enodeLow} adicionado.`);
    },
    'deleteLocalNode': async function (contract, func, args) {
        verifyArgsLength(2, func, args, syntax[func]);
        const enodeHigh = args[0];
        const enodeLow = args[1];
        const tx = await contract.deleteLocalNode(enodeHigh, enodeLow);
        await handleTx(tx);
        console.log(`\nNó ${enodeHigh} ${enodeLow} removido.`);
    },
    'updateLocalNode': async function (contract, func, args) {
        verifyArgsLength(4, func, args, syntax[func]);
        const enodeHigh = args[0];
        const enodeLow = args[1];
        const nodeType = getNodeType(args[2]);
        const name = args[3];
        const tx = await contract.updateLocalNode(enodeHigh, enodeLow, nodeType, name);
        await handleTx(tx);
        console.log(`\nNó ${enodeHigh} ${enodeLow} atualizado.`);
    },
    'updateLocalNodeStatus': async function (contract, func, args) {
        verifyArgsLength(3, func, args, syntax[func]);
        const enodeHigh = args[0];
        const enodeLow = args[1];
        const active = getBoolean(args[2]);
        const tx = await contract.updateLocalNodeStatus(enodeHigh, enodeLow, active);
        await handleTx(tx);
        console.log(`\nNó ${enodeHigh} ${enodeLow} atualizado.`);
    },
    'isNodeActive': async function (contract, func, args) {
        verifyArgsLength(2, func, args, syntax[func]);
        const enodeHigh = args[0];
        const enodeLow = args[1];
        const active = await contract.isNodeActive(enodeHigh, enodeLow);
        console.log(`\nNó ${enodeHigh} ${enodeLow} ativo: ${active}`);
    },
    'getNode': async function (contract, func, args) {
        verifyArgsLength(2, func, args, syntax[func]);
        const enodeHigh = args[0];
        const enodeLow = args[1];
        const nodeData = await contract.getNode(enodeHigh, enodeLow);
        console.log(`\nNó ${nodeData[0]} ${nodeData[1]}:\n Org: ${nodeData[4]}\n Type: ${getNodeTypeName(nodeData[2])}\n Name: ${nodeData[3]}\n Active: ${nodeData[5]}`);
    },
    'getNumberOfNodes': async function (contract, func, args) {
        verifyArgsLength(0, func, args, syntax[func]);
        const numNodes = await contract.getNumberOfNodes();
        console.log(`\nQuantidade de nós: ${numNodes}`);
    },
    'getNodes': async function (contract, func, args) {
        verifyArgsLength(2, func, args, syntax[func]);
        const pageNumber = args[0];
        const pageSize = args[1];
        const nodes = await contract.getNodes(pageNumber, pageSize);
        console.log(`\nEnodeHigh;EnodeLow;Org;Type;Name;Active`);
        for(node of nodes) {
            console.log(`${node[0]};${node[1]};${node[4]};${getNodeTypeName(node[2])};${node[3]};${node[5]}`);
        }
    },
    'getNumberOfNodesByOrg': async function (contract, func, args) {
        verifyArgsLength(1, func, args, syntax[func]);
        const orgId = args[0];
        const numNodes = await contract.getNumberOfNodesByOrg(orgId);
        console.log(`\nQuantidade de nós da organização ${orgId}: ${numNodes}`);
    },
    'getNodesByOrg': async function (contract, func, args) {
        verifyArgsLength(3, func, args, syntax[func]);
        const orgId = args[0];
        const pageNumber = args[1];
        const pageSize = args[2];
        const nodes = await contract.getNodesByOrg(orgId, pageNumber, pageSize);
        console.log(`\nEnodeHigh;EnodeLow;Org;Type;Name;Active`);
        for(node of nodes) {
            console.log(`${node[0]};${node[1]};${node[4]};${getNodeTypeName(node[2])};${node[3]};${node[5]}`);
        }
    }
};

async function run() {
    await setup();
    await diagnostics();
    const nodeRulesV2Address = getParameter('NODE_RULES_V2_ADDRESS');
    console.log(`NodeRulesV2Impl: ${nodeRulesV2Address}\n`);
    const nodesContract = new ethers.Contract(nodeRulesV2Address, NODE_RULES_V2_ABI, getSigner());

    const [func, args] = getFunctionArgs(__filename);
    if(func.toLowerCase() === 'help') {
        help(syntax);
        return;
    }

    console.log('==================================================');
    console.log(`NodeRulesV2.${func}(${args})`);
    console.log('==================================================');
    
    if(nodeRulesV2[func] == undefined) {
        console.log(`Função ${func} não encontrada`);
        process.exit(2);
    }
    await nodeRulesV2[func](nodesContract, func, args);
}

run();
