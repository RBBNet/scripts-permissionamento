const { ethers } = require("ethers");
require('dotenv').config();

const ingressAbi = [
    "function setContractAddress(bytes32 name, address addr)"
];

async function main(){
    console.log("Iniciando reponteiramento de regras");
    const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log(`Usando o endereço ${signer.address} para enviar as transações`);
    const accountIngressAddr = process.env.ACCOUNT_INGRESS_ADDRESS;
    const nodeIngressAddr = process.env.NODE_INGRESS_ADDRESS;
    const newAccountRulesAddr = process.env.ACCOUNT_RULES_V2_ADDRESS;
    const newNodeRulesAddr = process.env.NODE_RULES_V2_ADDRESS;
    const rulesContractName = "0x72756c6573000000000000000000000000000000000000000000000000000000";
    if(!newAccountRulesAddr || !newNodeRulesAddr){
        throw new Error("Endereços de contrato da Gen02 não encontrados no .env");
    }
    const accountIngress = new ethers.Contract(accountIngressAddr, ingressAbi, signer);
    const nodeIngress = new ethers.Contract(nodeIngressAddr, ingressAbi, signer);
    console.log(`\n Reponteirando AccountIngress (${accountIngressAddr} para ${newAccountRulesAddr})`);
    const tx1 = await accountIngress.setContractAddress(rulesContractName, newAccountRulesAddr);
    console.log(`Transação enviada: ${tx1.hash}`);
    await tx1.wait();
    console.log("Reponteiramento do AccountIngress concluido.");

    console.log(`\n Reponteirando NodeIngress (${nodeIngressAddr} para ${newNodeRulesAddr})`);
    const tx2 = await nodeIngress.setContractAddress(rulesContractName, newNodeRulesAddr);
    console.log(`Transação enviada: ${tx2.hash}`);
    await tx2.wait();
    console.log("Reponteiramento do NodeIngress concluido.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
