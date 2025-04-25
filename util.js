const path = require('path');
const ethers = require('ethers');

require('dotenv').config();

let jsonRpcUrl;
let provider;
let signer;

function getJsonRpcUrl() {
    return jsonRpcUrl;
}

function getProvider() {
    return provider;
}

function getSigner() {
    return signer;
}

function setup() {
    jsonRpcUrl = process.env['JSON_RPC_URL'];
    provider = new ethers.JsonRpcProvider(jsonRpcUrl);
    signer = new ethers.Wallet(process.env['PRIVATE_KEY']);
    signer = signer.connect(provider);
}

async function diagnostics() {
    const network = await provider.getNetwork();
    console.log('--------------------------------------------------');
    console.log(`URL JSON RPC: ${jsonRpcUrl}`);
    console.log(`Network: ${network.name}`);
    console.log(`Conta em uso: ${signer.address}`);
    console.log();
}

function getBoolean(value) {
    value = value.toLowerCase();
    if(value === 'true') {
        return true;
    }
    if(value === 'false') {
        return false;
    }
    throw new Error('Valor booleano inválido: ' + value);
}

function getRoleId(role) {
    switch(role) {
        case 'GLOBAL_ADMIN_ROLE': return '0xd6e7d8560c69c7c18c2b8f3b45430215d788f128f0c04bc4a3607fe05eb5399f';
        case 'LOCAL_ADMIN_ROLE': return '0xb7f8beecafe1ad662cec1153812612581a86b9460f21b876f3ee163141203dcb';
        case 'DEPLOYER_ROLE': return '0xfc425f2263d0df187444b70e47283d622c70181c5baebb1306a01edba1ce184c';
        case 'USER_ROLE' : return '0x14823911f2da1b49f045a0929a60b8c1f2a7fc8c06c7284ca3e8ab4e193a08c8';
        default: throw new Error('Role inválida: ' + role);
    }
}

function getRole(roleId) {
    switch(roleId) {
        case '0xd6e7d8560c69c7c18c2b8f3b45430215d788f128f0c04bc4a3607fe05eb5399f': return 'GLOBAL_ADMIN_ROLE';
        case '0xb7f8beecafe1ad662cec1153812612581a86b9460f21b876f3ee163141203dcb': return 'LOCAL_ADMIN_ROLE';
        case '0xfc425f2263d0df187444b70e47283d622c70181c5baebb1306a01edba1ce184c': return 'DEPLOYER_ROLE';
        case '0x14823911f2da1b49f045a0929a60b8c1f2a7fc8c06c7284ca3e8ab4e193a08c8': return 'USER_ROLE';
        default: throw new Error('Role ID inválido: ' + roleId);
    }
}

function getNodeType(type) {
    switch(type) {
        case 'Boot': return 0;
        case 'Validator': return 1;
        case 'Writer': return 2;
        case 'WriterPartner' : return 3;
        case 'ObserverBoot' : return 4;
        case 'Observer' : return 5;
        case 'Other' : return 6;
        default: throw new Error('Tipo de nó inválido: ' + type);
    }
}

function getNodeTypeName(type) {
    switch(parseInt(type, 10)) {
        case 0: return 'Boot';
        case 1: return 'Validator';
        case 2: return 'Writer';
        case 3: return 'WriterPartner';
        case 4: return 'ObserverBoot';
        case 5: return 'Observer';
        case 6: return 'Other';
        default: throw new Error('Tipo de nó inválido: ' + type);
    }
}

function getOrgTypeName(type) {
    switch(parseInt(type, 10)) {
        case 0: return 'Partner';
        case 1: return 'Associate';
        case 2: return 'Patron';
        default: throw new Error('Tipo de organização inválido: ' + type);
    }
}

function getVote(vote) {
    switch(parseInt(vote, 10)) {
        case 0: return 'NotVoted';
        case 1: return 'Approval';
        case 2: return 'Rejection';
        default: throw new Error('Valor de voto inválido: ' + vote);
    }
}

function getProposalStatus(status) {
    switch(parseInt(status, 10)) {
        case 0: return 'Active';
        case 1: return 'Canceled';
        case 2: return 'Finished';
        case 3: return 'Executed';
        default: throw new Error('Valor de status inválido: ' + status);
    }
}

function getProposalResult(result) {
    switch(parseInt(result, 10)) {
        case 0: return 'Undefined';
        case 1: return 'Approved';
        case 2: return 'Rejected';
        default: throw new Error('Valor de resultado inválido: ' + result);
    }
}

function getFunctionArgs(scriptFileName) {
    const scriptName = path.basename(scriptFileName);
    const numArgs = process.argv.length;
    if(numArgs < 3) {
        console.log(`Utilizar sintaxe: node ${scriptName} <function> [...args]`);
        console.log(`Para ajuda, use:  node ${scriptName} help`);
        process.exit(1);
    }
    const func = process.argv[2];
    let args;
    if(numArgs > 3) {
        args = getArgs(process.argv.slice(3, numArgs));
    }
    else {
        args = [];
    }
    return [func, args];
}

function getArgs(processArgs) {
    const args = [];
    let loadingArray = false;
    let tempArray;
    for(pArg of processArgs) {
        if(pArg.startsWith('[')) {
            if(loadingArray) {
                throw new Error(`Array aninhado não permitido: ${processArgs}`);
            }
            loadingArray = true;
            tempArray = [];
            pArg = pArg.substring(1, pArg.length);
        }
        if(pArg.endsWith(']')) {
            if(!loadingArray) {
                throw new Error(`Array demarcado incorretamente: ${processArgs}`);
            }
            if(pArg.length > 1) {
                pArg = pArg.substring(0, pArg.length - 1);
                tempArray.push(pArg);
            }
            args.push(tempArray);
            loadingArray = false;
        }
        else if(pArg.length > 0) {
            if(loadingArray) {
                tempArray.push(pArg);
            }
            else {
                args.push(pArg);
            }
        }
    }
    return args
}

function verifyArgsLength(argsLength, func, args, syntax) {
    if(args.length != argsLength) {
        console.log(`Função ${func} requer ${argsLength} parâmetro(s): ${syntax}`);
        process.exit(3);
    }
}

function verifyArgsMinLength(argsMinLength, func, args, syntax) {
    if(args.length < argsMinLength) {
        console.log(`Função ${func} requer ao menos ${argsLength} parâmetro(s): ${syntax}`);
        process.exit(3);
    }
}

async function handleTx(tx) {
    console.log();
    console.log(tx);
    const rec = await tx.wait();
    console.log();
    console.log(rec);
}

function help(syntax) {
    const functions = Object.getOwnPropertyNames(syntax);
    console.log('Funcões disponíveis:');
    for(f of functions) {
        console.log(` ${syntax[f]}`);
    }
}

module.exports = {
    getJsonRpcUrl: getJsonRpcUrl,
    getProvider: getProvider,
    getSigner: getSigner,
    setup: setup,
    diagnostics: diagnostics,
    getFunctionArgs: getFunctionArgs,
    getArgs: getArgs,
    verifyArgsLength: verifyArgsLength,
    verifyArgsMinLength: verifyArgsMinLength,
    getBoolean: getBoolean,
    getRoleId: getRoleId,
    getRole: getRole,
    getNodeType: getNodeType,
    getNodeTypeName: getNodeTypeName,
    getOrgTypeName: getOrgTypeName,
    getVote: getVote,
    getProposalStatus: getProposalStatus,
    getProposalResult: getProposalResult,
    handleTx: handleTx,
    help: help
}
