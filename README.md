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
