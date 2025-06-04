const ethers = require('ethers');
const vault = require('./vault-client.js');

async function run (useVault = true) {
    const wallet = ethers.Wallet.createRandom();
    if (!useVault) {
        console.log('\n*** ATENÇÃO ***\nManter a chave privada sob sigilo, de forma segura.\n');
        console.log(`Conta / Endereço:           ${wallet.address}`);
        console.log(`Chave privada:              ${wallet.privateKey}`);
        console.log(`Chave pública:              ${wallet.signingKey.publicKey}`);
        console.log(`Chave pública (comprimida): ${wallet.publicKey}`);
        console.log(`Frase mnemônica:            ${wallet.mnemonic.phrase}`);
        return;
    }

    try {
        const vaultClient = await vault.authenticate();
        const data = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey,
            publicKeyExt: wallet.signingKey.publicKey,
            mnemonic: wallet.mnemonic.phrase
        }
        
        // console.log(data);
        await vault.writeSecret(vaultClient, data);
        console.log('Secret was written to Vault successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

run();