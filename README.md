# Scripts de permissionamento para o Rundeck

Diferentemente da versão interativa, esses scripts não têm um "main" onde é possível escolher os parâmetros. Portanto, esse readme servirá como guia para eventuais dúvidas.

## 1 - O que é necessário
* Node.js instalado (preferencialmente vindo do dev-env)
* Um arquivo keypath.json com o caminho para a chave privada (que o usuário deverá criar no mesmo diretório dos scripts). Esse arquivo key deve conter APENAS o caminho no formato json, ou seja, entre aspas duplas.
É suposto que a chave privada fique no arquivo apontado. Exemplo:
``{
  "path": "C:\\Users\\etc\\chavePrivada.txt"
}``

## 2 - Como executar
Primeiro, é necessário ir ao cmd do Windows/Linux e rodar `yarn install` para trazer as ABIs. Depois disso, é suposto que os scripts estejam prontos para serem executados.

Os diferentes scripts esperam diferentes parâmetros, mas seguem uma regra geral para serem chamados: 

`node script[Nodes/Admins/Accounts].js [http://ip-da-rede:porta] [endereço-do-contrato] [parâmetro-1] [outros-parâmetros]`

* Possibilidades para o parâmetro 1:
  * 1 - adicionar
  * 2 - remover
  * 3 - listar

* Outros parâmetros:
  * Para o scriptNodes.js (nessa ordem):
    * 1 - enodeHigh  - adicionar, remover
    * 2 - enodeLow - adicionar, remover
    * 3 - nodeType - adicionar
    * 4 - name - adicionar
    * 5 - organization - adicionar

  * Para o scriptAccounts.js (nessa ordem):
    * 1 - address - adicionar, remover

  * Para o scriptAdmins.js (nessa ordem):
    * 1 - address - adicionar, remover

De forma que "listar" não espera mais nenhum outro parâmetro além do primeiro. Exemplo:

` node scriptNodes.js http://IP:PORTA ENDEREÇO-CONTRATO 3 `

Já adicionar e remover espera outros parâmetros. Exemplo:

`node scriptNodes.js http://IP:PORTA ENDEREÇO-CONTRATO 1 ENODE-HIGH ENODE-LOW NODE-TYPE NAME ORGANIZATION `

`node scriptAccounts.js http://IP:PORTA ENDEREÇO-CONTRATO 2 ENDEREÇO-CONTA`
