# Configuração Scripts + Vault (via AppRole)

O script de configuração de acesso ao Vault [vault-client](../vault-client.js) assume configuração através de AppRole (RoleID + SecretID).

> Obs1. Caso não tenha acesso a uma aplicação Vault, é possível [criar uma instância local do Vault em modo produção](#rodar-e-inicializar-vault-em-ambiente-local).

> Obs2. Caso sua aplicação Vault não esteja configurada, [configure AppRole (RoleID + SecretID)](#configurar-autenticação-via-approle).

Defina as seguintes variáveis de ambiente para acessar o Vault:
| Nome da Variável       | Descrição                                      | Valor Exemplo           |
|-------------------------|------------------------------------------------|-------------------------|
| `VAULT_ADDR`           | Endereço do servidor onde está hospedada a aplicação Vault                     | `http://127.0.0.1:8200` |
| `VAULT_ROLE_ID`           | Identificador do AppRole para autenticação     |              |
| `VAULT_SECRET_ID`    | Secret ID do AppRole para autenticação          |              |
| `VAULT_ROLE_NAME`    | Nome base do secret path         | `rbb`             |
| `VAULT_SECRET_NAME`    | Nome final do secret path          | `admin_wallet`             |

Os demais scripts irão acessar a chave privada da conta armazenada em `${VAULT_ADDR}/v1/secret/data/{VAULT_ROLE_NAME}/{VAULT_SECRET_NAME}`. 

Verifique se a kv engine v2 está configurada para o caminho `secret/`. Verifique se AppRole está configurado para o caminho `approle/`. Verifique se o token de autenticação tem permissão para acessar o caminho do segredo. Verifique se o Vault está `unsealed`.

> Não é preciso especificar `PRIVATE_KEY` ou `PRIVATE_KEY_PATH`.

## Gerar conta (par de chaves) e armazenar no Vault

Para gerar par de chaves ETH e armazenar as credenciais no Vault, execute o seguinte script:

```bash
node generate-key.js
```

A conta será armazenada como no exemplo:

```bash
{
  address: '0x0F30E2A648A99462ECF631A0DAD0097c0d98Fc77',
  privateKey: '0x43809ef4dd0331876ee405bda453e5dfce24fb635edaa057ae30dfa7352f71e9',
  publicKey: '0x0249cd6ecd6a94400100ce5545ca04c5e4414025eff2319aff61eef4bc2e38d518',
  publicKeyExt: '0x0449cd6ecd6a94400100ce5545ca04c5e4414025eff2319aff61eef4bc2e38d5188c67d27a4ee0feba038546728b14abd636d44ce85a7369fbcff4a29d37e480dc',
  mnemonic: 'receive cluster rose wing credit tell goddess april auction pretty mix base'
}
```

> Verifique se os scripts estão chamando função `setup()` com o parâmetro `useVault=true`. É a opção default. 

## Rodar e Inicializar Vault em ambiente local

O arquivo [docker-compose.yaml](./docker-compose.yaml) cria um container Docker para o Vault em modo de produção, persistindo os segredos. Depois de rodá-lo, é preciso inicializar o Vault e configurar o token de root.

> Não é recomendado usar o valor de token `root` em ambientes de produção. Para mais informações, consulte a [documentação oficial do Vault](https://developer.hashicorp.com/vault/tutorials/secrets-management/versioned-kv?variants=vault-deploy%3Aselfhosted#lab-setup).

```bash
cd vault
docker compose up -d
```

O Vault estará disponível em `http://0.0.0.0:8200`

Para inicializar o Vault, utilize o script [init-vault.sh](./init-vault.sh). Configure a quantidade de chaves de unseal. Especifique os parametros no arquivo `.env` na raiz do projeto:

| Nome da Variável       | Descrição                                      | Valor Exemplo           |
|-------------------------|------------------------------------------------|-------------------------|
| `VAULT_ADDR`           | Endereço do servidor onde está hospedada a aplicação Vault                     | `http://127.0.0.1:8200` |            
| `VAULT_KEY_SHARES`    | Quantidade de chaves de unseal a serem geradas         | `5`             |
| `VAULT_KEY_THRESHOLD`    | Quantidade mínima de chaves para realizar unseal        | `3`             |

Para inicializar o Vault, execute:

```bash
cd vault
bash init-vault.sh
```
> As credenciais serão exibidas na tela. Guarde as chaves de unseal e o token de root em local seguro. Você precisará delas para acessar o Vault.

## Configurar autenticação via AppRole

O script [app-vault.sh](./app-vault.sh) faz o unseal e configura autenticação via AppRole. Especifique os parametros no arquivo `.env` na raiz do projeto:


| Nome da Variável       | Descrição                                      | Valor Exemplo           |
|-------------------------|------------------------------------------------|-------------------------|
| `VAULT_ADDR`           | Endereço do servidor onde está hospedada a aplicação Vault                     | `http://127.0.0.1:8200` |            
| `VAULT_ROLE_NAME`    | Nome base do secret path         | `rbb`             |
| `VAULT_TOKEN`    | (Opcional) Token de autenticação inicial         | `root`             |
| `VAULT_UNSEAL_KEY_#`    | (Opcional) Chave `#` (índice) de unseal         |             |

> Não é recomendado armazenar token e chaves de unseal no arquivo `.env` em ambientes de produção. Caso não especificado, o script irá solicitar as credenciais via terminal.

Para gerar autenticação via AppRole, execute:

```bash
cd vault
bash app-vault.sh
```

O script irá gerar um AppRole e copiar os valores de `VAULT_ROLE_ID` e `VAULT_SECRET_ID` para arquivo de ambiente `.env` na raiz do projeto.
