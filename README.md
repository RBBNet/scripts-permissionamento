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

...

Funcões disponíveis:
 addLocalAccount <account> <roleId> <dataHash>
 deleteLocalAccount <account>
 updateLocalAccount <account> <roleId> <dataHash>
 updateLocalAccountStatus <account> <active>
 setAccountTargetAccess <account> <restricted> [allowedTarget_1 ... allowedTarget_N]
 isAccountActive <account>
 getAccount <account>
 getNumberOfAccounts
 getAccounts <pageNumber> <pageSize>
 getNumberOfAccountsByOrg <orgId>
 getAccountsByOrg <orgId> <pageNumber> <pageSize>
 getAccountTargetAccess <account>
 getNumberOfRestrictedAccounts
 getRestrictedAccounts <pageNumber> <pageSize>
 getSmartContractSenderAccess <smartContract>
 getNumberOfRestrictedSmartContracts
 getRestrictedSmartContracts <pageNumber> <pageSize>
```

Domínios de parâmetros utilizados pelas funções:
- `roleId`: `GLOBAL_ADMIN_ROLE`, `LOCAL_ADMIN_ROLE`, `DEPLOYER_ROLE` ou `USER_ROLE`
- `active`: `true` ou `false`
- `restricted`: `true` ou `false`

Para executar uma função:
```
node account-rules-v2.js <function> ...args...
```

Exemplos de uso:
```
node account-rules-v2.js addLocalAccount 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc USER_ROLE 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
node account-rules-v2.js deleteLocalAccount 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
node account-rules-v2.js getNumberOfAccounts
node account-rules-v2.js getAccounts 1 20
node account-rules-v2.js setAccountTargetAccess 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 true [0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC 0x90F79bf6EB2c4f870365E785982E1f101E93b906]
```

**Observação**: Algumas funções do permissionamento de contas somente podem ser executadas através de propostas de governança e, portanto, não estão disponíveis nesse script.


### Permissionamento de nós

Para o permisionamento de nós, deve-se usar o script `node-rules-v2.js`.

Para obter ajuda e saber as funções disponíveis:
```
node node-rules-v2.js help

...

Funcões disponíveis:
 addLocalNode <enodeHigh> <enodeLow> <nodeType> <name>
 deleteLocalNode <enodeHigh> <enodeLow>
 updateLocalNode <enodeHigh> <enodeLow> <nodeType> <name>
 updateLocalNodeStatus <enodeHigh> <enodeLow> <active>
 isNodeActive <enodeHigh> <enodeLow>
 getNode <enodeHigh> <enodeLow>
 getNumberOfNodes
 getNodes <pageNumber> <pageSize>
 getNumberOfNodesByOrg <orgId>
 getNodesByOrg <orgId> <pageNumber> <pageSize>
```

Domínios de parâmetros utilizados pelas funções:
- `nodeType`: `Boot`, `Validator`, `Writer`, `WriterPartner`, `ObserverBoot`, `Observer` ou `Other`
- `active`: `true` ou `false`

Para executar uma função:
```
node node-rules-v2.js <function> ...args...
```

Exemplos de uso:
```
node node-rules-v2.js addLocalNode 0x000000000000000000000000000000000000000000000000000000000000000a 0x000000000000000000000000000000000000000000000000000000000000000b Boot boot02
node node-rules-v2.js getNode 0x000000000000000000000000000000000000000000000000000000000000000a 0x000000000000000000000000000000000000000000000000000000000000000b
node node-rules-v2.js updateLocalNodeStatus 0x000000000000000000000000000000000000000000000000000000000000000a 0x000000000000000000000000000000000000000000000000000000000000000b false
node node-rules-v2.js getNumberOfNodesByOrg 1
```

**Observação**: Algumas funções do permissionamento de nós somente podem ser executadas através de propostas de governança e, portanto, não estão disponíveis nesse script.


### Consultas ao cadastro de organizações

Para realizar consultas ao cadastro de organizações, deve-se usar o script `organization.js`.

Para obter ajuda e saber as funções disponíveis:
```
node organization.js help

...

Funcões disponíveis:
 isOrganizationActive <orgId>
 getOrganization <orgId>
 getOrganizations
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

**Observação**: Algumas funções da gestão de organizações somente podem ser executadas através de propostas de governança e, portanto, não estão disponíveis nesse script.


### Gestão de propostas de governança

Para a gestão de propostas de governança, deve-se usar o script `governance.js`.

Para obter ajuda e saber as funções disponíveis:
```
node governance.js help

...

Funcões disponíveis:
 createProposal [target_1 ... target_N] [calldata_1 ... calldata_N], <blocksDuration>, <description>
 cancelProposal <proposalId> <reason>
 castVote <proposalId> <approve>
 executeProposal <proposalId>
 getProposal <proposalId>
 getNumberOfProposals
 getProposals <pageNumber> <pageSize>
```

Domínios de parâmetros utilizados pelas funções:
- `approve`: `true` ou `false`

Para executar uma função:
```
node governance.js <function> ...args...
```

Exemplos de uso:
```
node governance.js createProposal [0xfEdf5D0eC5FCF22FfC28Ed352217ed879dB2D0af] [0x21c074b8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e303430383239393330303031343900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000054942494354000000000000000000000000000000000000000000000000000000] 30000 "Adicionar nova organização"
node governance.js castVote 1 true
node governance.js getProposal 1
```


### Codificação de chamadas para propostas de governança

Para a criação de propostas de governança da rede (através da função `createProposal`), deve-se fornecer os dados necessários para realização de chamadas a *smart contracts*, contemplando:
1. Os *targets*: endereços dos *smart contracts* a serem chamados.
2. Os *calldatas*: dados de entrada, contendo a identificação da função a ser chamada e seus parâmetros de entrada, [codificados conforme a ABI](https://docs.soliditylang.org/en/latest/abi-spec.html) do *smart contract*.

A obtenção e preparação de tais informações não são triviais e, caso sejam feitas de forma manual, são propensas a erro. Para reduzir o trabalho e os riscos envolvidos, pode-se utilizar o script `calldata.js`, que já funcionalidades para obtenção de *targets* e *calldatas* de *smart contracts* e funções pré-selecionadas, envolvendo atividades já previstas para serem executadas pela governança, como por exemplo o reponteiramento do permissionamento, gestão de administradores master e gestão de organizações.

Para obter ajuda e saber as funções disponíveis:
```
node calldata.js help
Contratos e funções disponíveis:

AccountIngress
 setContractAddress <name> <address>
 removeContract <name>

NodeIngress
 setContractAddress <name> <address>
 removeContract <name>

Admin
 addAdmin <account>
 removeAdmin <account>
 addAdmins [account_1 ... account_N]

Organization
 addOrganization <cnpj> <name> <orgType> <canVote>
 updateOrganization <orgId> <cnpj> <name> <orgType> <canVote>
 deleteOrganization <orgId>

AccountRulesV2Impl
 addAccount <account> <orgId> <roleId> <dataHash>
 deleteAccount <account>
 setSmartContractSenderAccess <smartContract> <restricted> [allowedSender_1 ... allowedSender_N]

NodeRulesV2Impl
 addNode <enodeHigh> <enodeLow> <nodeType> <name> <orgId>
 deleteNode <enodeHigh> <enodeLow>
```

Domínios de parâmetros utilizados:
- `name` (para os contratos `AccountIngress` e `NodeIngress`): `RULES_CONTRACT` ou `ADMIN_CONTRACT`
- `orgType`: `Partner`, `Associate` ou `Patron`
- `canVote`: `true` ou `false`
- `roleId`: `GLOBAL_ADMIN_ROLE`, `LOCAL_ADMIN_ROLE`, `DEPLOYER_ROLE` ou `USER_ROLE`
- `restricted`: `true` ou `false`
- `nodeType`: `Boot`, `Validator`, `Writer`, `WriterPartner`, `ObserverBoot`, `Observer` ou `Other`

Para obter o *target* e o *calldata* para uma determinada chamada:
```
node calldata.js <contract> <function> ...args...
```

Exemplos de uso:
```
node calldata.js Organization addOrganization 33657248000189 "Banco Nacional de Desenvolvimento Econômico e Social" Patron true
Chamada para Organization.addOrganization 33657248000189,Banco Nacional de Desenvolvimento Econômico e Social,Patron,true

Target:
0xfEdf5D0eC5FCF22FfC28Ed352217ed879dB2D0af

Calldata:
0x21c074b8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000e3333363537323438303030313839000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003542616e636f204e6163696f6e616c20646520446573656e766f6c76696d656e746f2045636f6ec3b46d69636f206520536f6369616c0000000000000000000000
```

```
node calldata.js AccountRulesV2Impl addAccount 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 1 GLOBAL_ADMIN_ROLE 0x0000000000000000000000000000000000000000000000000000000000000000
Chamada para AccountRulesV2Impl.addAccount 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199,1,GLOBAL_ADMIN_ROLE,0x0000000000000000000000000000000000000000000000000000000000000000

Target:
0xa6dDA3665B3980D4e1efFf2F4438033C6c779b22

Calldata:
0x18aa38100000000000000000000000008626f6940e2eb28930efb4cef49b2d1f2c9c11990000000000000000000000000000000000000000000000000000000000000001d6e7d8560c69c7c18c2b8f3b45430215d788f128f0c04bc4a3607fe05eb5399f0000000000000000000000000000000000000000000000000000000000000000
```


### Diagnóstico de permissionamento da rede

É possível fazer um diagnóstico rápido da situação do permissionamento da rede através do script `permissioning-diagnostics.js`.

Para executar o diagnóstico:
```
node permissioning-diagnostics.js
--------------------------------------------------
URL JSON RPC: http://localhost:8545
Network: unknown
Conta em uso: 0x71bE63f3384f5fb98995898A86B02Fb2426c5788

==================================================
Gen01
==================================================
--------------------------------------------------
Configuração do ponteiramento
 AccountIngress está atualmente configurado para 0xb61675b164351767e5eCDC0Cc1e78E53f7fa5bd0
 NodeIngress está atualmente configurado para 0x31c91FD3540b5cE5780AFe47E442814e229BC019

--------------------------------------------------
Contas de admin master
 - 0x71bE63f3384f5fb98995898A86B02Fb2426c5788
...

==================================================
Gen02
==================================================
--------------------------------------------------
Organizações
 - 1 33657248000189 BNDES Patron pode votar
...

--------------------------------------------------
Contas
 - 0x71bE63f3384f5fb98995898A86B02Fb2426c5788: Org 1, GLOBAL_ADMIN_ROLE, Data Hash 0x0000000000000000000000000000000000000000000000000000000000000000, Active true
...

--------------------------------------------------
Nós
 - 0x0000000000000000000000000000000000000000000000000000000000000001 0x0000000000000000000000000000000000000000000000000000000000000002: boot01, Org 1, Boot, Active true
...
```

Como resultado, serão reportados:
- Configuração de ponteiramento dos *smart contracts* de permissionamento de contas (`AccountIngress`) e de nós (`NodeIngress`).
- Lista de contas de admin master.
- Organizações cadastradas.
- Contas permissionadas.
- Nós permissionados.


### Sintaxe de parâmetros

Para a utilização dos scripts, deve-se tomar cuidados ao fornecer os parâmetros de forma correta, respeitando formatos específicos para cada tipo de dado.

#### Sensibilidade a letras maiúsculas e minúsculas

De forma geral, os parâmetros são sensíveis na utilização de letras maiúsculas e minúsculas. Portanto, por exemplo, utilizar `AccountRulesV2Impl` é diferente de utilizar `accountrulesv2impl` e `addOrganization` é diferente de utilizar `AddOrganization`.

#### Parâmetros address

Parâmetros que representem valores do tipo `address` devem ser informados no formado `0x0000000000000000000000000000000000000000`. Isto é, um número hexadecimal de 40 dígitos precedido do prefixo `0x`.

#### Parâmetros bytes32

Parâmetros que representem valores do tipo `bytes32` devem ser informados no formado `0x0000000000000000000000000000000000000000000000000000000000000000`. Isto é, um número hexadecimal de 64 dígitos precedido do prefixo `0x`.

#### Parâmetros booleanos

Parâmetros que representem valores booleanos devem ser informados pelos valores `true` ou `false`, em letras minúsculas.

#### Parâmetros string

Parâmetros que representes strings podem ser informados diretamente na linha de comando. Caso o texto contenha espaços em branco, então a string deve ser delimitada por aspas (`"`). Exemplo: `"Banco Nacional de Desenvolvimento Econômico e Social"`

#### Parâmetros array

Parâmetros que representem arrays devem ser delimitados por colchetes (`[` e `]`) e ter seus elementos separados por espaços. **NÃO** separar os elementos com vígulas ou ponto e vírgula.

Exemplos de arrays vazios:
```
[]
[ ]
```

Exemplos de arrays com 1 elemento:
```
[0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199]
[ 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 ]
```

Exemplos de arrays com 2 elementos:
```
[0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 0x90F79bf6EB2c4f870365E785982E1f101E93b906]
[ 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 0x90F79bf6EB2c4f870365E785982E1f101E93b906 ]
```

Exemplos de arrays com mais de 2 elementos:
```
[0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 0x90F79bf6EB2c4f870365E785982E1f101E93b906 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC]
[ 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 0x90F79bf6EB2c4f870365E785982E1f101E93b906 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC ]
```
