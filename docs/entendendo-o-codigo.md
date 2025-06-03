Este projeto implementa um conjunto de scripts Node.js para **interação** e administração de contratos inteligentes de permissionamento na geração 2 (PermGen2) da RBB. Este documento apresenta uma análise detalhada do funcionamento, arquitetura e relacionamento entre os arquivos principais do projeto.

---

## Arquitetura Geral

O projeto é composto por scripts que permitem:
- Gerenciar contas e nós permissionados.
- Consultar e administrar organizações.
- Gerar chaves privadas.
- Diagnosticar o estado do permissionamento da rede.
- Gerar calldata para propostas de governança.
- Interagir com contratos de governança (propostas, votos, execução).

Todos os scripts compartilham utilitários e constantes comuns, centralizados nos arquivos util.js e constants.js.

---

## Descrição dos Arquivos e Relacionamentos

### 1. util.js
**Função:**  
Arquivo central de utilidades. Fornece funções para:
- Carregar variáveis de ambiente e configuração.
- Inicializar provider e signer do ethers.js.
- Manipular tipos e parâmetros (roles, tipos de nó, tipos de organização, etc).
- Validar argumentos de linha de comando.
- Exibir ajuda e diagnosticar ambiente.

**Dependências:**  
- Usado por praticamente todos os outros scripts.
- Depende de `ethers`, `dotenv`, `fs`, `path`.

---

### 2. constants.js
**Função:**  
Define as ABIs dos contratos inteligentes relevantes (Admin, Ingress, Organization, AccountRulesV2, NodeRulesV2, Governance) e constantes de identificação de contratos.

**Dependências:**  
- Usado por todos os scripts que interagem com contratos inteligentes.

---

### 3. account-rules-v2.js
**Função:**  
Permite gerenciar contas permissionadas (adicionar, remover, atualizar, consultar, etc) via contrato AccountRulesV2.

**Relacionamento:**  
- Usa util.js para configuração, parsing de argumentos e helpers.
- Usa constants.js para ABI do contrato.
- Executa funções do contrato via ethers.js.

---

### 4. node-rules-v2.js
**Função:**  
Gerencia nós permissionados (adicionar, remover, atualizar, consultar, etc) via contrato NodeRulesV2.

**Relacionamento:**  
- Usa util.js e constants.js.
- Estrutura e lógica similar ao script de contas.

---

### 5. organization.js
**Função:**  
Consulta informações sobre organizações cadastradas (status, dados, lista).

**Relacionamento:**  
- Usa util.js e constants.js.
- Não executa funções administrativas (essas são feitas via governança).

---

### 6. governance.js
**Função:**  
Permite criar, cancelar, votar e executar propostas de governança, além de consultar propostas existentes.

**Relacionamento:**  
- Usa util.js e constants.js.
- Inicializa contratos relevantes para decodificação de calldata e exibição de informações detalhadas.
- Utiliza helpers para formatar e exibir propostas e votos.

---

### 7. calldata.js
**Função:**  
Gera o calldata (dados codificados) para chamadas de contratos que serão usadas em propostas de governança. Facilita a criação correta de transações para governança.

**Relacionamento:**  
- Usa util.js e constants.js.
- Não executa transações, apenas gera os dados necessários.

---

### 8. permissioning-diagnostics.js
**Função:**  
Executa diagnósticos do estado do permissionamento da rede, exibindo:
- Configuração dos contratos Ingress.
- Admins master.
- Organizações.
- Contas e nós permissionados.

**Relacionamento:**  
- Usa util.js e constants.js.
- Executa várias leituras em contratos diferentes.

---

### 9. transaction-allowed.js
**Função:**  
Verifica se uma determinada conta pode realizar uma transação para um alvo específico, consultando o contrato AccountRulesV2.

**Relacionamento:**  
- Usa util.js e constants.js.

---

### 10. connection-allowed.js
**Função:**  
Verifica se uma conexão entre dois nós é permitida, consultando o contrato NodeRulesV2.

**Relacionamento:**  
- Usa util.js e constants.js.

---

### 11. generate-key.js
**Função:**  
Gera uma nova chave privada Ethereum, exibindo endereço, chave privada, chave pública e frase mnemônica.

**Relacionamento:**  
- Usa apenas `ethers`.

---

## Fluxo de Dependências

```
[util.js] <--- [constants.js]
   ^                ^
   |                |
   +----+-----------+-----------------------------+
        |           |                             |
[account-rules-v2.js] [node-rules-v2.js] [organization.js] [governance.js] [calldata.js] [permissioning-diagnostics.js] [transaction-allowed.js] [connection-allowed.js]
```
- Todos os scripts principais dependem de util.js e constants.js.
- generate-key.js é independente.

---

## Resumo das Responsabilidades

- **util.js:** Utilitários e helpers para todos os scripts.
- **constants.js:** ABIs e constantes dos contratos.
- **Scripts de permissão:** account-rules-v2.js, node-rules-v2.js, organization.js.
- **Governança:** governance.js, calldata.js.
- **Diagnóstico:** permissioning-diagnostics.js.
- **Verificação de permissão:** transaction-allowed.js, connection-allowed.js.
- **Geração de chave:** generate-key.js.

---

## Conclusão

O projeto é modular, com scripts especializados para cada aspecto do permissionamento e governança da rede. O uso centralizado de utilitários e constantes garante padronização e facilita manutenção. A arquitetura permite fácil extensão para novas funcionalidades de administração on-chain.

