const ethers = require('ethers');
const wallet = ethers.Wallet.createRandom();
console.log('\n*** ATENÇÃO ***\nManter a chave privada sob sigilo, de forma segura.\n');
console.log(`Conta / Endereço:           ${wallet.address}`);
console.log(`Chave privada:              ${wallet.privateKey}`);
console.log(`Chave pública:              ${wallet.signingKey.publicKey}`);
console.log(`Chave pública (comprimida): ${wallet.publicKey}`);
console.log(`Frase mnemônica:            ${wallet.mnemonic.phrase}`);
