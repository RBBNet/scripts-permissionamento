# Scripts para execução de *smart contracts* de Permissionamento da RBB - Segunda Geração (gen02)

Este repositório contém o código utilizado para realização de chamadas aos *smart contracts* de [permissionamento](https://github.com/RBBNet/Permissionamento) da RBB, contemplando especificamente a segunda geração do permissionamento (gen02).

Para obter os scripts que realizam chamadas à primeira geração do permissionamento (gen01), verifique a release [v.1.0.1+2023-10-23](https://github.com/RBBNet/scripts-permissionamento/releases/tag/1.0.1).


## Dependências

Para baixar as dependências do projeto:

```shell
npm install
```

## Configuração

Os scripts dependem de parâmetros de configuração para sua execução. Os parâmetros devem ser configurados através de variáveis de ambiente ou através de arquivo `.env`. A saber:
- `JSON_RPC_URL`: URL para interface JSON RPC do nó a ser usado para acesso à blockchain.
- `ADMIN_ADDRESS`: Endereço do *smart contract* `Admin` da gen01.
- `ORGANIZATION_ADDRESS`: Endereço do *smart contract* de `OrganizationImpl`.
- `ACCOUNT_RULES_V2_ADDRESS`: Endereço do *smart contract* de `AccountRulesV2Impl`.
- `GOVERNANCE_ADDRESS`: Endereço do *smart contract* de `Governance`.
- `NODE_RULES_V2_ADDRESS`: Endereço do *smart contract* de `NodeRulesV2Impl`.
- `PRIVATE_KEY`: Chave privada da conta a ser usada para envio de transações.
- `PRIVATE_KEY_PATH`: Caminho de arquivo que contém a chave privada da conta a ser usada para envio de transações.

**Observação**: Para definição da chave privada, deve-se usar **apenas uma** das seguintes variáveis: `PRIVATE_KEY` ou `PRIVATE_KEY_PATH`. Sendo que se ambas forem definidas, a variável `PRIVATE_KEY` terá prescedência.


## Scripts


### Permissionamento de contas

Para o permisionamento de contas, deve-se usar o script `account-rules-v2.js`.

Para obter ajuda e saber as funções disponíveis:
```
node account-rules-v2.js help
```

Para executar uma função:
```
node account-rules-v2.js <function> ...args...
```

Domínios de parâmetros utilizados pelas funções:
- `roleId`: `GLOBAL_ADMIN_ROLE`, `LOCAL_ADMIN_ROLE`, `DEPLOYER_ROLE` ou `USER_ROLE`
- `active`: `true` ou `false`
- `restricted`: `true` ou `false`

Exemplos de uso:
```
node account-rules-v2.js addLocalAccount 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc USER_ROLE 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
node account-rules-v2.js deleteLocalAccount 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
node account-rules-v2.js getNumberOfAccounts
node account-rules-v2.js getAccounts 1 20
node account-rules-v2.js setAccountTargetAccess 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 true [0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC 0x90F79bf6EB2c4f870365E785982E1f101E93b906]
```

**Observação**: Algumas funções do permissionamento de contas somente podem ser executadas através de propostas de governança.


### Permissionamento de nós

Para o permisionamento de nós, deve-se usar o script `node-rules-v2.js`.

Para obter ajuda e saber as funções disponíveis:
```
node node-rules-v2.js help
```

Para executar uma função:
```
node node-rules-v2.js <function> ...args...
```

Domínios de parâmetros utilizados pelas funções:
- `nodeType`: `Boot`, `Validator`, `Writer`, `WriterPartner`, `ObserverBoot`, `Observer` ou `Other`
- `active`: `true` ou `false`

Exemplos de uso:
```
node node-rules-v2.js addLocalNode 0x000000000000000000000000000000000000000000000000000000000000000a 0x000000000000000000000000000000000000000000000000000000000000000b Boot boot02
node node-rules-v2.js getNode 0x000000000000000000000000000000000000000000000000000000000000000a 0x000000000000000000000000000000000000000000000000000000000000000b
node node-rules-v2.js updateLocalNodeStatus 0x000000000000000000000000000000000000000000000000000000000000000a 0x000000000000000000000000000000000000000000000000000000000000000b false
node node-rules-v2.js getNumberOfNodesByOrg 1
```

**Observação**: Algumas funções do permissionamento de nós somente podem ser executadas através de propostas de governança.


### Consultas ao cadastro de organizações

Para realizar consultas ao cadastro de organizações, deve-se usar o script `organization.js`.

Para obter ajuda e saber as funções disponíveis:
```
node organization.js help
```

Para executar uma função:
```
node organization.js <function> ...args...
```

Exemplos de uso:
```
node organization.js isOrganizationActive 1
node organization.js getOrganization 1
node organization.js getOrganizations
```

**Observação**: Algumas funções da gestão de organizações somente podem ser executadas através de propostas de governança.


### Gestão de propostas de governança

Para a gestão de propostas de governança, deve-se usar o script `governance.js`.

Para obter ajuda e saber as funções disponíveis:
```
node governance.js help
```

Para executar uma função:
```
node governance.js <function> ...args...
```

Domínios de parâmetros utilizados pelas funções:
- `approve`: `true` ou `false`

Exemplos de uso:
```
node governance.js createProposal [0xfEdf5D0eC5FCF22FfC28Ed352217ed879dB2D0af] [0x21c074b8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e303430383239393330303031343900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000054942494354000000000000000000000000000000000000000000000000000000] 30000 "Adicionar nova organização"
node governance.js castVote 1 true
node governance.js getProposal 1
```


### Codificação de chamadas para propostas de governança


### Diagnóstico de permissionamento da rede

É possível fazer um diagnóstico rápido da situação do permissionamento da rede através do script `permissioning-diagnostics.js`.

Para executar o diagnóstico:
```
node permissioning-diagnostics.js
```

Como resultado, serão reportados:
- Configuração de ponteiramento dos *smart contracts* de permissionamento de contas (`AccountIngress`) e de nós (`NodeIngress`).
- Lista de contas de admin master.
- Organizações cadastradas.
- Contas permissionadas.
- Nós permissionados.


### Sintaxe de parâmetros


#### Parâmetros string


#### Parâmetros array
