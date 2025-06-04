#!/bin/bash

# Exit on error
set -e

# Change location if necessary
ENV_PATH="../.env" 

# Source environment variables from .env file if it exists
if [ -f ${ENV_PATH} ]; then
    echo "Loading environment variables from \"${ENV_PATH}\" file..."
    source "${ENV_PATH}"
else
    echo "\"${ENV_PATH}\" file not found."
    exit 1
fi

# Configurable variables
VAULT_ADDR="${VAULT_ADDR:-http://127.0.0.1:8200}"
VAULT_TOKEN="${VAULT_TOKEN:-root}"
ROLE_NAME="${VAULT_ROLE_NAME:-test}"

# Headers
HEADERS=(-H "X-Vault-Token: ${VAULT_TOKEN}" -H "Content-Type: application/json")

echo "Vault address: $VAULT_ADDR"
echo "Using token: $VAULT_TOKEN"
echo "Role: $ROLE_NAME"
echo

# 1. Enable AppRole auth method
echo "Enabling AppRole auth method..."
curl -s --request POST "${VAULT_ADDR}/v1/sys/auth/approle" \
    "${HEADERS[@]}" \
    --data '{"type": "approle"}' || echo "AppRole may already be enabled."

echo

# 2. Create custom policy
echo "Creating policy for role ${ROLE_NAME}..."
cat <<EOF > policy.json
{
  "policy": "path \\"secret/data/${ROLE_NAME}/*\\" { capabilities = [\\"create\\", \\"read\\", \\"update\\", \\"delete\\", \\"list\\"] }"
}
EOF

curl -s --request PUT "${VAULT_ADDR}/v1/sys/policies/acl/${ROLE_NAME}-policy" \
     "${HEADERS[@]}" \
     --data @policy.json

rm policy.json
echo

# 3. Create AppRole with policies
echo "Creating AppRole ${ROLE_NAME}..."
curl -s --request POST "${VAULT_ADDR}/v1/auth/approle/role/${ROLE_NAME}" \
    "${HEADERS[@]}" \
    --data "{\"policies\": \"${ROLE_NAME}-policy\", \"token_type\": \"batch\"}"

echo

# 4. Retrieve role_id
echo "Retrieving role_id..."
ROLE_ID=$(curl -s --request GET "${VAULT_ADDR}/v1/auth/approle/role/${ROLE_NAME}/role-id" \
    "${HEADERS[@]}" | jq -r '.data.role_id')

# echo "ROLE_ID: $ROLE_ID"

echo

# 5. Generate secret_id
echo "Generating secret_id..."
SECRET_ID=$(curl -s --request POST "${VAULT_ADDR}/v1/auth/approle/role/${ROLE_NAME}/secret-id" \
    "${HEADERS[@]}" | jq -r '.data.secret_id')

# echo "SECRET_ID: $SECRET_ID"

echo
echo "AppRole setup complete!"
# echo "========================="
# echo "ROLE_ID: ${ROLE_ID}"
# echo "SECRET_ID: ${SECRET_ID}"

# Export to .env file
echo "VAULT_ROLE_ID=${ROLE_ID}" >> ${ENV_PATH}
echo "VAULT_SECRET_ID=${SECRET_ID}" >> ${ENV_PATH}
