const dotenv = require('dotenv');
const vault = require('node-vault');

dotenv.config();

const VAULT_ADDR = process.env.VAULT_ADDR;
const ROLE_ID = process.env.VAULT_ROLE_ID;
const SECRET_ID = process.env.VAULT_SECRET_ID;
const SECRET_PATH = `secret/data/${process.env.VAULT_ROLE_NAME}/${process.env.VAULT_SECRET_NAME}`;
const API_VERSION = 'v1';

const authenticate = async (
  endpoint = VAULT_ADDR,
  roleId = ROLE_ID,
  secretId = SECRET_ID,
  apiVersion = API_VERSION
) => {
  // Vault client without authentication
  const vaultClient = vault({
    apiVersion: apiVersion,
    endpoint: endpoint
  });

  // Auth request via AppRole
  const authResult = await vaultClient.approleLogin({
    role_id: roleId,
    secret_id: secretId
  });
  const clientToken = authResult.auth.client_token;

  // Vault client authenticated with token
  return vault({
    apiVersion: apiVersion,
    endpoint: endpoint,
    token: clientToken
  });
};

const writeSecret = async (client, data, secretPath = SECRET_PATH) => {
  await client.write(secretPath, {
    data: data
  });
};

const readSecret = async (client, secretPath = SECRET_PATH) => {
  const readResponse = await client.read(secretPath);
  return readResponse.data.data;
};

module.exports = {
  authenticate,
  writeSecret,
  readSecret
};
