const ethers = require('ethers');
const { setup, getParameter, diagnostics, getSigner, getFunctionArgs, verifyArgsLength, getOrgTypeName, help } = require('./util.js');
const { ORGANIZATION_ABI } = require('./constants.js');

const syntax = {
    'isOrganizationActive': 'isOrganizationActive <orgId>',
    'getOrganization': 'getOrganization <orgId>',
    'getOrganizations': 'getOrganizations',
};

const organization = {
    'isOrganizationActive': async function (contract, func, args) {
        verifyArgsLength(1, func, args, syntax[func]);
        const orgId = args[0];
        const active = await contract.isOrganizationActive(orgId);
        console.log(`\nOrganização ${orgId} ativa: ${active}`);
    },
    'getOrganization': async function (contract, func, args) {
        verifyArgsLength(1, func, args, syntax[func]);
        const orgId = args[0];
        const orgData = await contract.getOrganization(orgId);
        console.log(`\Organização ${orgData[0]}:\n CNPJ: ${orgData[1]}\n Nome: ${orgData[2]}\n Tipo: ${getOrgTypeName(orgData[3])}\n Pode votar: ${orgData[4]}`);
    },
    'getOrganizations': async function (contract, func, args) {
        verifyArgsLength(0, func, args, syntax[func]);
        const orgs = await contract.getOrganizations();
        console.log(`\nId;CNPJ;Nome;Tipo;Pode votar`);
        for(org of orgs) {
            console.log(`${org[0]};${org[1]};${org[2]};${getOrgTypeName(org[3])};${org[4]}`);
        }
    }
};

async function run() {
    await diagnostics();
    const organizationAddress = getParameter('ORGANIZATION_ADDRESS');
    console.log(`Organization: ${organizationAddress}\n`);
    
    const organizationContract = new ethers.Contract(organizationAddress, ORGANIZATION_ABI, getSigner());
    const [func, args] = getFunctionArgs(__filename);

    if(func.toLowerCase() === 'help') {
        help(syntax);
        return;
    }

    console.log('==================================================');
    console.log(`OrganizationImpl.${func}(${args})`);
    console.log('==================================================');
    
    if(organization[func] == undefined) {
        console.log(`Função ${func} não encontrada`);
        process.exit(2);
    }
    await organization[func](organizationContract, func, args);
}

setup();
run();
