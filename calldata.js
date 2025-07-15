const ethers = require('ethers');
const path = require('path');
const { getArgs, verifyArgsLength, getParameter, getOrgType, getBoolean, getNodeType, getRoleId, getIngressNameId } = require('./util.js');
const { ADMIN_ABI, INGRESS_ABI, ORGANIZATION_ABI, ACCOUNT_RULES_V2_ABI, NODE_RULES_V2_ABI, GOVERNANCE_ABI } = require('./constants.js');

const syntax = {
    'AccountIngress': {
        'setContractAddress': 'setContractAddress <name> <address>',
        'removeContract': 'removeContract <name>'
    },
    'NodeIngress': {
        'setContractAddress': 'setContractAddress <name> <address>',
        'removeContract': 'removeContract <name>'
    },
    'Admin': {
        'addAdmin': 'addAdmin <account>',
        'removeAdmin': 'removeAdmin <account>',
        'addAdmins': 'addAdmins [account_1 ... account_N]'
    },
    'OrganizationImpl': {
        'addOrganization': 'addOrganization <cnpj> <name> <orgType> <canVote>',
        'updateOrganization': 'updateOrganization <orgId> <cnpj> <name> <orgType> <canVote>',
        'deleteOrganization': 'deleteOrganization <orgId>'
    },
    'AccountRulesV2Impl': {
        'addAccount': 'addAccount <account> <orgId> <roleId> <dataHash>',
        'deleteAccount': 'deleteAccount <account>',
        'setSmartContractSenderAccess': 'setSmartContractSenderAccess <smartContract> <restricted> [allowedSender_1 ... allowedSender_N]',
    },
    'NodeRulesV2Impl': {
        'addNode': 'addNode <enodeHigh> <enodeLow> <nodeType> <name> <orgId>',
        'deletNode': 'deleteNode <enodeHigh> <enodeLow>'
    },
    'Governance': {
        'cancelProposal': 'cancelProposal <proposalId> <reason>'
    }
};

const accountIgressAddress = getParameter('ACCOUNT_INGRESS_ADDRESS');
const accountIngressContract = new ethers.Contract(accountIgressAddress, INGRESS_ABI);
const nodeIgressAddress = getParameter('NODE_INGRESS_ADDRESS');
const nodeIngressContract = new ethers.Contract(nodeIgressAddress, INGRESS_ABI);
const adminAddress = getParameter('ADMIN_ADDRESS');
const adminContract = new ethers.Contract(adminAddress, ADMIN_ABI);
const organizationAddress = getParameter('ORGANIZATION_ADDRESS');
const organizationContract = new ethers.Contract(organizationAddress, ORGANIZATION_ABI);
const accountRulesV2Address = getParameter('ACCOUNT_RULES_V2_ADDRESS');
const accountsContract = new ethers.Contract(accountRulesV2Address, ACCOUNT_RULES_V2_ABI,);
const nodeRulesV2Address = getParameter('NODE_RULES_V2_ADDRESS');
const nodesContract = new ethers.Contract(nodeRulesV2Address, NODE_RULES_V2_ABI);
const governanceAddress = getParameter('NODE_RULES_V2_ADDRESS');
const governanceContract = new ethers.Contract(governanceAddress, GOVERNANCE_ABI);

const contracts = {
    'AccountIngress': {
        'setContractAddress': function(contractName, functionName, args) {
            verifyArgsLength(2, functionName, args, syntax[contractName][functionName]);
            const name = getIngressNameId(args[0]);
            const address = args[1];
            const calldata = accountIngressContract.interface.encodeFunctionData(accountIngressContract.setContractAddress.fragment, [name, address]);
            displayCalldata(contractName, functionName, args, accountIgressAddress, calldata);
        },
        'removeContract': function(contractName, functionName, args) {
            verifyArgsLength(1, functionName, args, syntax[contractName][functionName]);
            const name = getIngressNameId(args[0]);
            const calldata = accountIngressContract.interface.encodeFunctionData(accountIngressContract.removeContract.fragment, [name]);
            displayCalldata(contractName, functionName, args, accountIgressAddress, calldata);
        }
    },
    'NodeIngress': {
        'setContractAddress': function(contractName, functionName, args) {
            verifyArgsLength(2, functionName, args, syntax[contractName][functionName]);
            const name = getIngressNameId(args[0]);
            const address = args[1];
            const calldata = nodeIngressContract.interface.encodeFunctionData(nodeIngressContract.setContractAddress.fragment, [name, address]);
            displayCalldata(contractName, functionName, args, nodeIgressAddress, calldata);
        },
        'removeContract': function(contractName, functionName, args) {
            verifyArgsLength(1, functionName, args, syntax[contractName][functionName]);
            const name = getIngressNameId(args[0]);
            const calldata = nodeIngressContract.interface.encodeFunctionData(nodeIngressContract.removeContract.fragment, [name]);
            displayCalldata(contractName, functionName, args, nodeIgressAddress, calldata);
        }
    },
    'Admin': {
        'addAdmin': function(contractName, functionName, args) {
            verifyArgsLength(1, functionName, args, syntax[contractName][functionName]);
            const account = args[0];
            const calldata = adminContract.interface.encodeFunctionData(adminContract.addAdmin.fragment, [account]);
            displayCalldata(contractName, functionName, args, adminAddress, calldata);
        },
        'removeAdmin': function(contractName, functionName, args) {
            verifyArgsLength(1, functionName, args, syntax[contractName][functionName]);
            const account = args[0];
            const calldata = adminContract.interface.encodeFunctionData(adminContract.removeAdmin.fragment, [account]);
            displayCalldata(contractName, functionName, args, adminAddress, calldata);
        },
        'addAdmins': function(contractName, functionName, args) {
            verifyArgsLength(1, functionName, args, syntax[contractName][functionName]);
            const accounts = args[0];
            const calldata = adminContract.interface.encodeFunctionData(adminContract.addAdmins.fragment, [accounts]);
            displayCalldata(contractName, functionName, args, adminAddress, calldata);
        }
    },
    'OrganizationImpl': {
        'addOrganization': function(contractName, functionName, args) {
            verifyArgsLength(4, functionName, args, syntax[contractName][functionName]);
            const cnpj = args[0];
            const name = args[1];
            const orgType = getOrgType(args[2]);
            const canVote = getBoolean(args[3]);
            const calldata = organizationContract.interface.encodeFunctionData(organizationContract.addOrganization.fragment, [cnpj, name, orgType, canVote]);
            displayCalldata(contractName, functionName, args, organizationAddress, calldata);
        },
        'updateOrganization': function(contractName, functionName, args) {
            verifyArgsLength(5, functionName, args, syntax[contractName][functionName]);
            const orgId = args[0];
            const cnpj = args[1];
            const name = args[2];
            const orgType = getOrgType(args[3]);
            const canVote = getBoolean(args[4]);
            const calldata = organizationContract.interface.encodeFunctionData(organizationContract.updateOrganization.fragment, [orgId, cnpj, name, orgType, canVote]);
            displayCalldata(contractName, functionName, args, organizationAddress, calldata);
        },
        'deleteOrganization': function(contractName, functionName, args) {
            verifyArgsLength(1, functionName, args, syntax[contractName][functionName]);
            const orgId = args[0];
            const calldata = organizationContract.interface.encodeFunctionData(organizationContract.deleteOrganization.fragment, [orgId]);
            displayCalldata(contractName, functionName, args, organizationAddress, calldata);
        }
    },
    'AccountRulesV2Impl': {
        'addAccount': function(contractName, functionName, args) {
            verifyArgsLength(4, functionName, args, syntax[contractName][functionName]);
            const account = args[0];
            const orgId = args[1];
            const roleId = getRoleId(args[2]);
            const dataHash = args[3];
            const calldata = accountsContract.interface.encodeFunctionData(accountsContract.addAccount.fragment, [account, orgId, roleId, dataHash]);
            displayCalldata(contractName, functionName, args, accountRulesV2Address, calldata);
        },
        'deleteAccount': function(contractName, functionName, args) {
            verifyArgsLength(1, functionName, args, syntax[contractName][functionName]);
            const account = args[0];
            const calldata = accountsContract.interface.encodeFunctionData(accountsContract.deleteAccount.fragment, [account]);
            displayCalldata(contractName, functionName, args, accountRulesV2Address, calldata);
        },
        'setSmartContractSenderAccess': function(contractName, functionName, args) {
            verifyArgsLength(3, functionName, args, syntax[contractName][functionName]);
            const smartContract = args[0];
            const restricted = getBoolean(args[1]);
            const allowedSenders = args[2];
            const calldata = accountsContract.interface.encodeFunctionData(accountsContract.setSmartContractSenderAccess.fragment, [smartContract, restricted, allowedSenders]);
            displayCalldata(contractName, functionName, args, accountRulesV2Address, calldata);
        }
    },
    'NodeRulesV2Impl': {
        'addNode': function(contractName, functionName, args) {
            verifyArgsLength(5, functionName, args, syntax[contractName][functionName]);
            const enodeHigh = args[0];
            const enodeLow = args[1];
            const nodeType = getNodeType(args[2]);
            const name = args[3];
            const orgId = args[4];
            const calldata = nodesContract.interface.encodeFunctionData(nodesContract.addNode.fragment, [enodeHigh, enodeLow, nodeType, name, orgId]);
            displayCalldata(contractName, functionName, args, nodeRulesV2Address, calldata);
        },
        'deleteNode': function(contractName, functionName, args) {
            verifyArgsLength(2, functionName, args, syntax[contractName][functionName]);
            const enodeHigh = args[0];
            const enodeLow = args[1];
            const calldata = nodesContract.interface.encodeFunctionData(nodesContract.deleteNode.fragment, [enodeHigh, enodeLow]);
            displayCalldata(contractName, functionName, args, nodeRulesV2Address, calldata);
        }
    },
    'Governance': {
        'cancelProposal': function(contractName, functionName, args) {
            verifyArgsLength(2, functionName, args, syntax[contractName][functionName]);
            const proposalId = args[0];
            const reason = args[1];
            const calldata = governanceContract.interface.encodeFunctionData(governanceContract.cancelProposal.fragment, [proposalId, reason]);
            displayCalldata(contractName, functionName, args, governanceAddress, calldata);
        }
    }
};

function displayCalldata(contractName, functionName, args, target, calldata) {
    console.log(`Chamada para ${contractName}.${functionName} ${args}`);
    console.log(`\nTarget:\n${target}`);
    console.log(`\nCalldata:\n${calldata}`);
}

function getCallParams() {
    const scriptName = path.basename(__filename);
    const numArgs = process.argv.length;
    if(numArgs < 3) {
        console.log(`Utilizar sintaxe: node ${scriptName} <contract> <function> ...args...`);
        console.log(`Para ajuda, use:  node ${scriptName} help`);
        process.exit(1);
    }
    const contractName = process.argv[2];
    let functionName;
    if(numArgs > 3) {
        functionName = process.argv[3];
    }
    let args;
    if(numArgs > 4) {
        args = getArgs(process.argv.slice(4, numArgs));
    }
    else {
        args = [];
    }
    return [contractName, functionName, args];
}

function help() {
    console.log('Contratos e funções disponíveis:');
    const contracts = Object.getOwnPropertyNames(syntax);
    for(contract of contracts) {
        console.log(`\n${contract}`);
        const functions = Object.getOwnPropertyNames(syntax[contract]);
        for(func of functions) {
            console.log(` ${syntax[contract][func]}`);
        }
    }    
}

function run() {
    const [contractName, functionName, args] = getCallParams();

    if(contractName.toLowerCase() === 'help') {
        help();
        return;
    }

    if(contracts[contractName] == undefined) {
        console.log(`Contrato ${contractName}. não encontrada`);
        process.exit(2);
    }
    if(contracts[contractName][functionName] == undefined) {
        console.log(`Função ${contractName}.${functionName} não encontrada`);
        process.exit(2);
    }
            
    contracts[contractName][functionName](contractName, functionName, args);
}

run();