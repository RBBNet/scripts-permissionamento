const ethers = require('ethers');
const { setup, getParameter, diagnostics, getSigner, getRole, getNodeTypeName, getOrgTypeName } = require('./util.js');
const { RULES_CONTRACT, INGRESS_ABI, ADMIN_ABI, ORGANIZATION_ABI, ACCOUNT_RULES_V2_ABI, NODE_RULES_V2_ABI } = require('./constants.js');

async function ingressDiagnostics() {
    console.log('--------------------------------------------------');
    console.log('Configuração do ponteiramento');

    try {
        const accountIgressAddress = getParameter('ACCOUNT_INGRESS_ADDRESS');
        const accountIngressContract = new ethers.Contract(accountIgressAddress, INGRESS_ABI, getSigner());
        const currentAccountRulessAddress = await accountIngressContract.getContractAddress(RULES_CONTRACT);
        console.log(` - AccountIngress está atualmente configurado para ${currentAccountRulessAddress}`);
    }
    catch(error) {
        console.log(` >>> Erro ao ler smart contract AccountIngress: ${error}`);
    }

    try {
        const nodeIgressAddress = getParameter('NODE_INGRESS_ADDRESS');
        const nodeIngressContract = new ethers.Contract(nodeIgressAddress, INGRESS_ABI, getSigner());
        const currentNodeRulessAddress = await nodeIngressContract.getContractAddress(RULES_CONTRACT);
        console.log(` - NodeIngress está atualmente configurado para ${currentNodeRulessAddress}`);
    }
    catch(error) {
        console.log(` >>> Erro ao ler smart contract NodeIngress: ${error}`);
    }

    console.log();
}

async function adminDiagnostics() {
    console.log('--------------------------------------------------');
    console.log('Contas de admin master');

    try {
        const adminAddress = getParameter('ADMIN_ADDRESS');
        const adminContract = new ethers.Contract(adminAddress, ADMIN_ABI, getSigner());
        const admins = await adminContract.getAdmins();
        for(admin of admins) {
            console.log(` - ${admin}`);
        }
    }
    catch(error) {
        console.log(` >>> Erro ao ler smart contract Admin: ${error}`);
    }

    console.log();
}

async function organizationDiagnostics() {
    console.log('--------------------------------------------------');
    console.log('Organizações');

    try {
        const organizationAddress = getParameter('ORGANIZATION_ADDRESS');
        const organizationContract = new ethers.Contract(organizationAddress, ORGANIZATION_ABI, getSigner());
        const orgs = await organizationContract.getOrganizations();
        for(org of orgs) {
            console.log(` - ${org[0]} ${org[1]} ${org[2]} ${getOrgTypeName(org[3])} ${org[4] ? 'pode votar' : ''}`);
        }
    }
    catch(error) {
        console.log(` >>> Erro ao ler smart contract Organization: ${error}`);
    }

    console.log();
}

async function accountsV2Diagnostics() {
    console.log('--------------------------------------------------');
    console.log('Contas');

    try {
        const accountRulesV2Address = getParameter('ACCOUNT_RULES_V2_ADDRESS');
        const accountsContract = new ethers.Contract(accountRulesV2Address, ACCOUNT_RULES_V2_ABI, getSigner());
        const numAccounts = await accountsContract.getNumberOfAccounts();
        if(numAccounts > 0) {
            const accounts = await accountsContract.getAccounts(1, numAccounts);
            for(acc of accounts) {
                console.log(` - ${acc[1]}: Org ${acc[0]}, ${getRole(acc[2])}, Data Hash ${acc[3]}, Active ${acc[4]}`);
            }
        }
    }
    catch(error) {
        console.log(` >>> Erro ao ler smart contract AccountRulesV2Impl: ${error}`);
    }
    
    console.log();
}

async function nodesV2Diagnostics() {
    console.log('--------------------------------------------------');
    console.log('Nós');

    try {
        const nodeRulesV2Address = getParameter('NODE_RULES_V2_ADDRESS');
        const nodesContract = new ethers.Contract(nodeRulesV2Address, NODE_RULES_V2_ABI, getSigner());
        const numNodes = await nodesContract.getNumberOfNodes();
        if(numNodes > 0) {
            const nodes = await nodesContract.getNodes(1, numNodes);
            for(node of nodes) {
                console.log(` - ${node[0]} ${node[1]}: ${node[3]}, Org ${node[4]}, ${getNodeTypeName(node[2])}, Active ${node[5]}`);
            }
        }
    }
    catch(error) {
        console.log(` >>> Erro ao ler smart contract NodeRulesV2Impl: ${error}`);
    }

    console.log();
}

async function run() {
    await setup();
    await diagnostics();

    console.log('==================================================');
    console.log('Gen01');
    console.log('==================================================');
    await ingressDiagnostics();
    await adminDiagnostics();

    console.log('==================================================');
    console.log('Gen02');
    console.log('==================================================');
    await organizationDiagnostics();
    await accountsV2Diagnostics();
    await nodesV2Diagnostics();
}

run();