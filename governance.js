const ethers = require('ethers');
const { setup, getParameter, diagnostics, getSigner, getFunctionArgs, verifyArgsLength, help, getProposalStatus, getProposalResult, getVote, handleTx, getBoolean } = require('./util.js');
const { GOVERNANCE_ABI } = require('./constants.js');

const syntax = {
    'createProposal': 'createProposal [target_1 ... target_N] [calldata_1 ... calldata_N] <blocksDuration> <description>',
    'cancelProposal': 'cancelProposal <proposalId> <reason>',
    'castVote': 'castVote <proposalId> <approve>',
    'executeProposal': 'executeProposal <proposalId>',
    'getProposal': 'getProposal <proposalId>',
    'getNumberOfProposals': 'getNumberOfProposals',
    'getProposals': 'getProposals <pageNumber> <pageSize>'
};

function formatTargets(targets) {
    let formated = '';
    for(t of targets) {
        formated = formated + '\n  ' + t;
    }
    return formated;
}

function formatCalldatas(calldatas) {
    let formated = '';
    for(c of calldatas) {
        formated = formated + '\n  ' + c;
    }
    return formated;
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
        console.log(`\nVoto enviado para a roposta ${proposalId}.`);
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
run();
