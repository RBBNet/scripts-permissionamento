const ADMIN_ABI = [
    'function addAdmin(address) public returns (bool)',
    'function removeAdmin(address) public returns (bool)',
    'function addAdmins(address[]) public returns (bool)',
    'function isAuthorized(address) public view returns (bool)',
    'function getAdmins() public view returns (address[])'
];
const INGRESS_ABI = [
    'function setContractAddress(bytes32, address) public returns (bool)',
    'function removeContract(bytes32) public returns(bool)',
    'function getContractAddress(bytes32) public view returns(address)'
];
const ORGANIZATION_ABI = [
    'function addOrganization(string calldata cnpj, string calldata name, uint8 orgType, bool canVote) external returns (uint)',
    'function updateOrganization(uint orgId, string calldata cnpj, string calldata name, uint8 orgType, bool canVote) external',
    'function deleteOrganization(uint orgId) external',
    'function isOrganizationActive(uint orgId) external view returns (bool)',
    'function getOrganization(uint orgId) external view returns (tuple(uint id, string cnpj, string name, uint8 orgType, bool canVote) memory)',
    'function getOrganizations() external view returns (tuple(uint id, string cnpj, string name, uint8 orgType, bool canVote)[] memory)'
];
const ACCOUNT_RULES_V2_ABI = [
    'function addLocalAccount(address account, bytes32 roleId, bytes32 dataHash) external',
    'function deleteLocalAccount(address account) external',
    'function updateLocalAccount(address account, bytes32 roleId, bytes32 dataHash) external',
    'function updateLocalAccountStatus(address account, bool active) external',
    'function setAccountTargetAccess(address account, bool restricted, address[] calldata allowedTargets) external',
    'function addAccount(address account, uint orgId, bytes32 roleId, bytes32 dataHash) external',
    'function deleteAccount(address account) external',
    'function setSmartContractSenderAccess(address smartContract, bool restricted, address[] calldata allowedSenders) external',
    'function isAccountActive(address account) external view returns (bool)',
    'function getAccount(address account) external view returns (tuple(uint orgId, address account, bytes32 roleId, bytes32 dataHash, bool active) memory)',
    'function getNumberOfAccounts() external view returns (uint)',
    'function getAccounts(uint pageNumber, uint pageSize) external view returns (tuple(uint orgId, address account, bytes32 roleId, bytes32 dataHash, bool active)[] memory)',
    'function getNumberOfAccountsByOrg(uint orgId) external view returns (uint)',
    'function getAccountsByOrg(uint orgId, uint pageNumber, uint pageSize) external view returns (tuple(uint orgId, address account, bytes32 roleId, bytes32 dataHash, bool active)[] memory)',
    'function getAccountTargetAccess(address account) external view returns (bool restricted, address[] memory)',
    'function getNumberOfRestrictedAccounts() external view returns (uint)',
    'function getRestrictedAccounts(uint pageNumber, uint pageSize) external view returns (address[] memory)',
    'function getSmartContractSenderAccess(address smartContract) external view returns (bool restricted, address[] memory)',
    'function getNumberOfRestrictedSmartContracts() external view returns (uint)',
    'function getRestrictedSmartContracts(uint pageNumber, uint pageSize) external view returns (address[] memory)',
    'function transactionAllowed(address sender, address target, uint256 value, uint256 gasPrice, uint256 gasLimit, bytes calldata payload) external view returns (bool)'
];
const NODE_RULES_V2_ABI = [
    'function addLocalNode(bytes32 enodeHigh, bytes32 enodeLow, uint8 nodeType, string memory name) external',
    'function deleteLocalNode(bytes32 enodeHigh, bytes32 enodeLow) external',
    'function updateLocalNode(bytes32 enodeHigh, bytes32 enodeLow, uint8 nodeType, string memory name) external',
    'function updateLocalNodeStatus(bytes32 enodeHigh, bytes32 enodeLow, bool active) external',
    'function addNode(bytes32 enodeHigh, bytes32 enodeLow, uint8 nodeType, string memory name, uint orgId) external',
    'function deleteNode(bytes32 enodeHigh, bytes32 enodeLow) external',
    'function isNodeActive(bytes32 enodeHigh, bytes32 enodeLow) external view returns (bool)',
    'function getNode(bytes32 enodeHigh, bytes32 enodeLow) external view returns (tuple(bytes32 enodeHigh, bytes32 enodeLow, uint8 nodeType, string name, uint orgId, bool active) memory)',
    'function getNumberOfNodes() external view returns (uint)',
    'function getNumberOfNodesByOrg(uint orgId) external view returns (uint)',
    'function getNodes(uint pageNumber, uint pageSize) external view returns (tuple(bytes32 enodeHigh, bytes32 enodeLow, uint8 nodeType, string name, uint orgId, bool active)[] memory)',
    'function getNodesByOrg(uint orgId, uint pageNumber, uint pageSize) external view returns (tuple(bytes32 enodeHigh, bytes32 enodeLow, uint8 nodeType, string name, uint orgId, bool active)[] memory)',
    'function connectionAllowed(bytes32 sourceEnodeHigh, bytes32 sourceEnodeLow, bytes16 sourceEnodeIp, uint16 sourceEnodePort, bytes32 destinationEnodeHigh, bytes32 destinationEnodeLow, bytes16 destinationEnodeIp, uint16 destinationEnodePort) external view returns (bytes32)'
];
const GOVERNANCE_ABI = [
    'function createProposal(address[] calldata targets, bytes[] memory calldatas, uint blocksDuration, string calldata description) public',
    'function cancelProposal(uint proposalId, string calldata reason) public',
    'function castVote(uint proposalId, bool approve) public',
    'function executeProposal(uint proposalId) public',
    'function getProposal(uint proposalId) public view returns (tuple(uint id, uint proponentOrgId, address[] targets, bytes[] calldatas, uint blocksDuration, string description, uint creationBlock, uint8 status, uint8 result, uint[] organizations, uint8[] votes, string cancelationReason) memory)',
    'function getNumberOfProposals() public view returns (uint)',
    'function getProposals(uint pageNumber, uint pageSize) public view returns (tuple(uint id, uint proponentOrgId, address[] targets, bytes[] calldatas, uint blocksDuration, string description, uint creationBlock, uint8 status, uint8 result, uint[] organizations, uint8[] votes, string cancelationReason)[] memory)'
];
const RULES_CONTRACT = '0x72756c6573000000000000000000000000000000000000000000000000000000';

module.exports = {
    ADMIN_ABI: ADMIN_ABI,
    INGRESS_ABI: INGRESS_ABI,
    ORGANIZATION_ABI: ORGANIZATION_ABI,
    ACCOUNT_RULES_V2_ABI: ACCOUNT_RULES_V2_ABI,
    NODE_RULES_V2_ABI: NODE_RULES_V2_ABI,
    GOVERNANCE_ABI: GOVERNANCE_ABI,
    RULES_CONTRACT: RULES_CONTRACT
}
