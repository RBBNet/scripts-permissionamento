const ethers = require('ethers');
const { setup, getParameter, diagnostics, getSigner, getFunctionArgs, verifyArgsLength, help, getProposalStatus, getProposalResult, getVote, handleTx, getBoolean } = require('./util.js');
const { INGRESS_ABI, ADMIN_ABI, ORGANIZATION_ABI, ACCOUNT_RULES_V2_ABI, NODE_RULES_V2_ABI, GOVERNANCE_ABI } = require('./constants.js');

const syntax = {
    'createProposal': 'createProposal [target_1 ... target_N] [calldata_1 ... calldata_N] <blocksDuration> <description>',
    'cancelProposal': 'cancelProposal <proposalId> <reason>',
    'castVote': 'castVote <proposalId> <approve>',
    'executeProposal': 'executeProposal <proposalId>',
    'getProposal': 'getProposal <proposalId>',
    'getNumberOfProposals': 'getNumberOfProposals',
    'getProposals': 'getProposals <pageNumber> <pageSize>'
};

const accountIgressAddress = getParameter('ACCOUNT_INGRESS_ADDRESS');
const accountIngressContract = new ethers.Contract(accountIgressAddress, INGRESS_ABI);
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

const targetMap = new Map();
const calldataMap = new Map();

function initFormatMaps() {
    initTargetMap();
    initCalldataMap();
}

function initTargetMap() {
    const accountIgressAddress = getParameter('ACCOUNT_INGRESS_ADDRESS');
    if(accountIgressAddress) {
        targetMap.set(accountIgressAddress, 'AccountIngress');
    }
    const nodeIgressAddress = getParameter('NODE_INGRESS_ADDRESS');
    if(nodeIgressAddress) {
        targetMap.set(nodeIgressAddress, 'NodeIngress');
    }
    const adminAddress = getParameter('ADMIN_ADDRESS');
    if(adminAddress) {
        targetMap.set(adminAddress, 'Admin');
    }
    const organizationAddress = getParameter('ORGANIZATION_ADDRESS');
    if(organizationAddress) {
        targetMap.set(organizationAddress, 'OrganizationImpl');
    }
    const accountRulesV2Address = getParameter('ACCOUNT_RULES_V2_ADDRESS');
    if(accountRulesV2Address) {
        targetMap.set(accountRulesV2Address, 'AccountRulesV2Impl');
    }
    const nodeRulesV2Address = getParameter('NODE_RULES_V2_ADDRESS');
    if(nodeRulesV2Address) {
        targetMap.set(nodeRulesV2Address, 'NodeRulesV2Impl');
    }
}

function getFunctionSelector(functionSignature) {
    return ethers.id(functionSignature).substring(0,10);
}

function initCalldataMap() {
    calldataMap.set(getFunctionSelector('setContractAddress(bytes32,address)'), [accountIngressContract, accountIngressContract.setContractAddress.fragment]);
    calldataMap.set(getFunctionSelector('removeContract(bytes32)'), [accountIngressContract, accountIngressContract.removeContract.fragment]);
    calldataMap.set(getFunctionSelector('addAdmin(address)'), [adminContract, adminContract.addAdmin.fragment]);
    calldataMap.set(getFunctionSelector('removeAdmin(address)'), [adminContract, adminContract.removeAdmin.fragment]);
    calldataMap.set(getFunctionSelector('addAdmins(address[])'), [adminContract, adminContract.addAdmins.fragment]);
    calldataMap.set(getFunctionSelector('addOrganization(string,string,uint8,bool)'), [organizationContract, organizationContract.addOrganization.fragment]);
    calldataMap.set(getFunctionSelector('updateOrganization(uint256,string,string,uint8,bool)'), [organizationContract, organizationContract.updateOrganization.fragment]);
    calldataMap.set(getFunctionSelector('deleteOrganization(uint256)'), [organizationContract, organizationContract.deleteOrganization.fragment]);
    calldataMap.set(getFunctionSelector('addAccount(address,uint256,bytes32,bytes32)'), [accountsContract, accountsContract.addAccount.fragment]);
    calldataMap.set(getFunctionSelector('deleteAccount(address)'), [accountsContract, accountsContract.deleteAccount.fragment]);
    calldataMap.set(getFunctionSelector('setSmartContractSenderAccess(address,bool,address[])'), [accountsContract, accountsContract.setSmartContractSenderAccess.fragment]);
    calldataMap.set(getFunctionSelector('addNode(bytes32,bytes32,uint8,string,uint256)'), [nodesContract, nodesContract.addNode.fragment]);
    calldataMap.set(getFunctionSelector('deleteNode(bytes32,bytes32) external'), [nodesContract, nodesContract.deleteNode.fragment]);
    calldataMap.set(getFunctionSelector('cancelProposal(uint256,string)'), [governanceContract, governanceContract.cancelProposal.fragment]);
}

function formatTargets(targets) {
    let formated = '';
    for(t of targets) {
        formated = formated + '\n  ' + formatTarget(t);
    }
    return formated;
}

function formatTarget(t) {
    const targetName = targetMap.get(t);
    return (targetName ? `${t} (${targetName})` : t);
}

function formatCalldatas(calldatas) {
    let formated = '';
    for(c of calldatas) {
        formated = formated + '\n  ' + formatCalldata(c);
    }
    return formated;
}

function formatCalldata(calldata) {
    const funcSelector = calldata.substring(0, 10);
    const funcFormaterData = calldataMap.get(funcSelector);
    if(funcFormaterData) {
        const contract = funcFormaterData[0];
        const fragment = funcFormaterData[1];
        const params = contract.interface.decodeFunctionData(fragment, calldata);
        let call = fragment.name + '(';
        for(let i = 0; i < params.length; ++i) {
            if(i > 0) {
                call = call + ',';
            }
            call = call + params[i];
        }
        call = call + ')';
        calldata = calldata + '\n   ' + call;
    }
    return calldata;
}

function formatVotes(votes) {
    return votes.map(v => getVote(v));
}

const governance = {
    'createProposal': async function (contract, func, args) {
        verifyArgsLength(4, func, args, syntax[func]);
        const targets = args[0];
        const calldatas = args[1];
        const blocksDuration = args[2];
        const description = args[3];
        const tx = await contract.createProposal(targets, calldatas, blocksDuration, description);
        await handleTx(tx);
        console.log('\nProposta criada.');
    },
    'cancelProposal': async function (contract, func, args) {
        verifyArgsLength(2, func, args, syntax[func]);
        const proposalId = args[0];
        const reason = args[1];
        const tx = await contract.cancelProposal(proposalId, reason);
        await handleTx(tx);
        console.log(`\nProposta ${proposalId} cancelada.`);
    },
    'castVote': async function (contract, func, args) {
        verifyArgsLength(2, func, args, syntax[func]);
        const proposalId = args[0];
        const approve = getBoolean(args[1]);
        const tx = await contract.castVote(proposalId, approve);
        await handleTx(tx);
        console.log(`\nVoto enviado para a proposta ${proposalId}.`);
    },
    'executeProposal': async function (contract, func, args) {
        verifyArgsLength(1, func, args, syntax[func]);
        const proposalId = args[0];
        const tx = await contract.executeProposal(proposalId);
        await handleTx(tx);
        console.log(`\nProposta ${proposalId} executada.`);
    },
    'getProposal': async function (contract, func, args) {
        verifyArgsLength(1, func, args, syntax[func]);
        const propId = args[0];
        const prop = await contract.getProposal(propId);
        console.log(`\nProposta ${prop[0]}:\n Proponent: ${prop[1]}\n Targets: ${formatTargets(prop[2])}\n Calldatas: ${formatCalldatas(prop[3])}\n Blocks duration: ${prop[4]}\n Description: ${prop[5]}\n Creation Block: ${prop[6]}\n Status: ${getProposalStatus(prop[7])}\n Result: ${getProposalResult(prop[8])}\n Organizations: ${prop[9]}\n Votes: ${formatVotes(prop[10])}\n Cancelation reason: ${prop[11]}`);
    },
    'getNumberOfProposals': async function (contract, func, args) {
        verifyArgsLength(0, func, args, syntax[func]);
        const numProposals = await contract.getNumberOfProposals();
        console.log(`\nQuantidade de propostas: ${numProposals}`);
    },
    'getProposals': async function (contract, func, args) {
        verifyArgsLength(2, func, args, syntax[func]);
        const pageNumber = args[0];
        const pageSize = args[1];
        const props = await contract.getProposals(pageNumber, pageSize);
        console.log(`\nId;Proponent;Targets;Calldatas;Blocks duration;Description;Creation block;Status;Result;Organizations;Votes;Cancelation reason]:`);
        for(prop of props) {
            console.log(`${prop[0]};${prop[1]};${prop[2]};${prop[3]};${prop[4]};${prop[5]};${prop[6]};${getProposalStatus(prop[7])};${getProposalResult(prop[8])};${prop[9]};${formatVotes(prop[10])};${prop[11]}`);
        }
    },
};

async function run() {
    await diagnostics();
    const governanceAddress = getParameter('GOVERNANCE_ADDRESS');
    console.log(`Governance: ${governanceAddress}\n`);
    const governanceContract = new ethers.Contract(governanceAddress, GOVERNANCE_ABI, getSigner());

    const [func, args] = getFunctionArgs(__filename);
    if(func.toLowerCase() === 'help') {
        help(syntax);
        return;
    }

    console.log('==================================================');
    console.log(`Governance.${func}(${args})`);
    console.log('==================================================');
    
    if(governance[func] == undefined) {
        console.log(`Função ${func} não encontrada`);
        process.exit(2);
    }
    await governance[func](governanceContract, func, args);
}

setup();
initFormatMaps();
run();
