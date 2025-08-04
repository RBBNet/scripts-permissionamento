const { ethers } = require("ethers");
const { setup, diagnostics, getParameter, getSigner, handleTx } = require('../util.js');
const { INGRESS_ABI, RULES_CONTRACT } = require('../constants.js');

async function main(){
    await diagnostics();
    console.log("Iniciando reponteiramento de regras");

    const accountIngressAddr = getParameter('ACCOUNT_INGRESS_ADDRESS');
    const nodeIngressAddr = getParameter('NODE_INGRESS_ADDRESS');
    const newAccountRulesAddr = getParameter('ACCOUNT_RULES_V2_ADDRESS');
    const newNodeRulesAddr = getParameter('NODE_RULES_V2_ADDRESS');

    if(!newAccountRulesAddr){
        throw new Error("Variável ACCOUNT_RULES_V2_ADDRESS não configurada");
    }
    if(!newNodeRulesAddr){
        throw new Error("Variável NODE_RULES_V2_ADDRESS não configurada");
    }

    const accountIngress = new ethers.Contract(accountIngressAddr, INGRESS_ABI, getSigner());
    const nodeIngress = new ethers.Contract(nodeIngressAddr, INGRESS_ABI, getSigner());

    console.log(`\nReponteirando AccountIngress (de ${accountIngressAddr} para ${newAccountRulesAddr})`);
    const tx1 = await accountIngress.setContractAddress(RULES_CONTRACT, newAccountRulesAddr);
    await handleTx(tx1);
    console.log("\nReponteiramento do AccountIngress concluido.");

    console.log(`\nReponteirando NodeIngress (de ${nodeIngressAddr} para ${newNodeRulesAddr})`);
    const tx2 = await nodeIngress.setContractAddress(RULES_CONTRACT, newNodeRulesAddr);
    await handleTx(tx2);
    console.log("\nReponteiramento do NodeIngress concluido.");
}

setup();
main();
