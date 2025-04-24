const ethers = require('ethers');
const { setup, getParameter, diagnostics, getSigner, getFunctionArgs, verifyArgsLength, verifyArgsMinLength, getBoolean, getRoleId, getRole, handleTx, help } = require('./util.js');
const { ACCOUNT_RULES_V2_ABI } = require('./constants.js');

const syntax = {
    'addLocalAccount': 'addLocalAccount <account> <roleId> <dataHash>',
    'deleteLocalAccount': 'deleteLocalAccount <account>',
    'updateLocalAccount': 'updateLocalAccount <account> <roleId> <dataHash>',
    'updateLocalAccountStatus': 'updateLocalAccountStatus <account> <active>',
    'setAccountTargetAccess' : 'setAccountTargetAccess <account> <restricted> [allowedTarget_1 ... allowedTarget_N]',
    'isAccountActive': 'isAccountActive <account>',
    'getAccount': 'getAccount <account>',
    'getNumberOfAccounts': 'getNumberOfAccounts',
    'getAccounts': 'getAccounts <pageNumber> <pageSize>',
    'getNumberOfAccountsByOrg': 'getNumberOfAccountsByOrg <orgId>',
    'getAccountsByOrg': 'getAccountsByOrg <orgId> <pageNumber> <pageSize>',
    'getAccountTargetAccess': 'getAccountTargetAccess <account>',
    'getNumberOfRestrictedAccounts': 'getNumberOfRestrictedAccounts',
    'getRestrictedAccounts': 'getRestrictedAccounts <pageNumber> <pageSize>',
    'getSmartContractSenderAccess': 'getSmartContractSenderAccess <smartContract>',
    'getNumberOfRestrictedSmartContracts': 'getNumberOfRestrictedSmartContracts',
    'getRestrictedSmartContracts': 'getRestrictedSmartContracts <pageNumber> <pageSize>'
};

const accountRulesV2 = {
    'addLocalAccount': async function (contract, func, args) {
        verifyArgsLength(3, func, args, syntax[func]);
        const account = args[0];
        const roleId = getRoleId(args[1]);
        const dataHash = args[2];
        const tx = await contract.addLocalAccount(account, roleId, dataHash);
        await handleTx(tx);
        console.log(`\nConta ${account} adicionada.`);
    },
    'deleteLocalAccount': async function (contract, func, args) {
        verifyArgsLength(1, func, args, syntax[func]);
        const account = args[0];
        const tx = await contract.deleteLocalAccount(account);
        await handleTx(tx);
        console.log(`\nConta ${account} removida.`);
    },
    'updateLocalAccount': async function (contract, func, args) {
        verifyArgsLength(3, func, args, syntax[func]);
        const account = args[0];
        const roleId = getRoleId(args[1]);
        const dataHash = args[2];
        const tx = await contract.updateLocalAccount(account, roleId, dataHash);
        await handleTx(tx);
        console.log(`\nConta ${account} atualizada.`);
    },
    'updateLocalAccountStatus': async function (contract, func, args) {
        verifyArgsLength(2, func, args, syntax[func]);
        const account = args[0];
        const active = getBoolean(args[1]);
        const tx = await contract.updateLocalAccountStatus(account, active);
        await handleTx(tx);
        console.log(`\nConta ${account} atualizada.`);
    },
    'setAccountTargetAccess': async function (contract, func, args) {
        verifyArgsMinLength(2, func, args, syntax[func]);
        const account = args[0];
        const restricted = getBoolean(args[1]);
        const allowedTargets = args[2];
        const tx = await contract.setAccountTargetAccess(account, restricted, allowedTargets);
        await handleTx(tx);
        console.log(`\nRestrição de acesso configurada para a conta ${account}.`);
    },
    'isAccountActive': async function (contract, func, args) {
        verifyArgsLength(1, func, args, syntax[func]);
        const account = args[0];
        const active = await contract.isAccountActive(account);
        console.log(`\nConta ${account} ativa: ${active}`);
    },
    'getAccount': async function (contract, func, args) {
        verifyArgsLength(1, func, args, syntax[func]);
        const account = args[0];
        const accountData = await contract.getAccount(account);
        console.log(`\nConta ${accountData[1]}:\n Org: ${accountData[0]}\n Role: ${getRole(accountData[2])}\n Data hash: ${accountData[3]}\n Active: ${accountData[4]}`);
    },
    'getNumberOfAccounts': async function (contract, func, args) {
        verifyArgsLength(0, func, args, syntax[func]);
        const numAccounts = await contract.getNumberOfAccounts();
        console.log(`\nQuantidade de contas: ${numAccounts}`);
    },
    'getAccounts': async function (contract, func, args) {
        verifyArgsLength(2, func, args, syntax[func]);
        const pageNumber = args[0];
        const pageSize = args[1];
        const accounts = await contract.getAccounts(pageNumber, pageSize);
        console.log(`\nAccount;Org;Role;Data hash;Active`);
        for(acc of accounts) {
            console.log(`${acc[1]};${acc[0]};${getRole(acc[2])};${acc[3]};${acc[4]}`);
        }
    },
    'getNumberOfAccountsByOrg': async function (contract, func, args) {
        verifyArgsLength(1, func, args, syntax[func]);
        const orgId = args[0];
        const numAccounts = await contract.getNumberOfAccountsByOrg(orgId);
        console.log(`\nQuantidade de contas da organização ${orgId}: ${numAccounts}`);
    },
    'getAccountsByOrg': async function (contract, func, args) {
        verifyArgsLength(3, func, args, syntax[func]);
        const orgId = args[0];
        const pageNumber = args[1];
        const pageSize = args[2];
        const accounts = await contract.getAccountsByOrg(orgId, pageNumber, pageSize);
        console.log(`\nAccount;Org;Role;Data hash;Active`);
        for(acc of accounts) {
            console.log(`${acc[1]};${acc[0]};${getRole(acc[2])};${acc[3]};${acc[4]}`);
        }
    },
    'getAccountTargetAccess': async function (contract, func, args) {
        verifyArgsLength(1, func, args, syntax[func]);
        const account = args[0];
        const resp = await contract.getAccountTargetAccess(account);
        const restricted = resp[0];
        const allowedTargets = resp[1];
        console.log(`\nContas ${account} com acesso restrito: ${restricted}`);
        for(target of allowedTargets) {
            console.log(` ${target}`);
        }
    },
    'getNumberOfRestrictedAccounts': async function (contract, func, args) {
        verifyArgsLength(0, func, args, syntax[func]);
        const numAccounts = await contract.getNumberOfRestrictedAccounts();
        console.log(`\nQuantidade de contas restrição de acesso configurada: ${numAccounts}`);
    },
    'getRestrictedAccounts': async function (contract, func, args) {
        verifyArgsLength(2, func, args, syntax[func]);
        const pageNumber = args[0];
        const pageSize = args[1];
        const accounts = await contract.getRestrictedAccounts(pageNumber, pageSize);
        console.log(`\nAccount`);
        for(acc of accounts) {
            console.log(`${acc}`);
        }
    },
    'getSmartContractSenderAccess': async function (contract, func, args) {
        verifyArgsLength(1, func, args, syntax[func]);
        const smartContract = args[0];
        const [restricted, senders] = await contract.getSmartContractSenderAccess(smartContract);
        console.log(`\nSmart contract ${smartContract} com acesso restrito: ${restricted}`);
        for(sender of senders) {
            console.log(` ${sender}`);
        }
    },
    'getNumberOfRestrictedSmartContracts': async function (contract, func, args) {
        verifyArgsLength(0, func, args, syntax[func]);
        const numSmartContracts = await contract.getNumberOfRestrictedSmartContracts();
        console.log(`\nQuantidade de smart contracts com restrição de acesso configurada: ${numSmartContracts}`);
    },
    'getRestrictedSmartContracts': async function (contract, func, args) {
        verifyArgsLength(2, func, args, syntax[func]);
        const pageNumber = args[0];
        const pageSize = args[1];
        const contracts = await contract.getRestrictedSmartContracts(pageNumber, pageSize);
        console.log(`\nSmart contracts`);
        for(sc of contracts) {
            console.log(`${sc}`);
        }
    }
};

async function run() {
    await diagnostics();
    const accountRulesV2Address = getParameter('accountRulesV2Address');
    console.log(`AccountRulesV2Impl: ${accountRulesV2Address}\n`);
    
    const accountsContract = new ethers.Contract(accountRulesV2Address, ACCOUNT_RULES_V2_ABI, getSigner());
    const [func, args] = getFunctionArgs(__filename);

    if(func.toLowerCase() === 'help') {
        help(syntax);
        return;
    }

    console.log('==================================================');
    console.log(`AccountRulesV2.${func}(${args})`);
    console.log('==================================================');
    
    if(accountRulesV2[func] == undefined) {
        console.log(`Função ${func} não encontrada`);
        process.exit(2);
    }
    await accountRulesV2[func](accountsContract, func, args);
}

setup();
run();
