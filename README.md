# Scripts para execução de *smart contracts* de Permissionamento da RBB - Segunda Geração (gen02)

Este repositório contém o código utilizado para realização de chamadas aos *smart contracts* de [permissionamento](https://github.com/RBBNet/Permissionamento) da RBB, contemplando especificamente a segunda geração do permissionamento (gen02).

Para obter os scripts que realizam chamadas à primeira geração do permissionamento (gen01), verifique a release [v.1.0.1+2023-10-23](https://github.com/RBBNet/scripts-permissionamento/releases/tag/1.0.1).


## Dependências

Para baixar as dependências do projeto:

```shell
npm install
```

## Configuração

Os scripts dependem de parâmetros de configuração para sua execução. Alguns parâmetros devem ser configurados através de variáveis de ambiente ou através de arquivo `.env`. A saber:
- `CONFIG_PARAMETERS`: Caminho do arquivo com os parâmetros de configuração.
  - Para o caso de blockchain local, o arquivo [`deploy/parameters-local.json`](deploy/parameters-local.json) já foi preparado.
- `PRIVATE_KEY`: Chave privada da conta a ser usada para envio de transações.

Os demais parâmetros de configuração devem ser ajustados no arquivo JSON de parâmetros, conforme especificado na variável `CONFIG_PARAMETERS`. A saber:
- `jsonRpcUrl`: URL para interface JSON RPC do nó a ser usado para acesso à blockchain.
- `organizationAddress`: Endereço do *smart contract* de `OrganizationImpl`.
- `accountRulesV2Address`: Endereço do *smart contract* de `AccountRulesV2Impl`.
- `governanceAddress`: Endereço do *smart contract* de `Governance`.
- `nodeRulesV2Address`: Endereço do *smart contract* de `NodeRulesV2Impl`.
