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
ROLE_NAME="${VAULT_ROLE_NAME:-test}"
VAULT_KEY_THRESHOLD="${VAULT_KEY_THRESHOLD:-3}"

echo "Vault address: $VAULT_ADDR"
echo "Role: $ROLE_NAME"
echo "Unseal key threshold: $VAULT_KEY_THRESHOLD"
echo

# Check if VAULT_TOKEN is set
if [ -z "$VAULT_TOKEN" ]; then
    echo "VAULT_TOKEN is not set. Please provide the Vault token."
    read -s -p "Enter Vault token: " VAULT_TOKEN
    echo
fi

# Headers
HEADERS=(-H "X-Vault-Token: ${VAULT_TOKEN}" -H "Content-Type: application/json")


# 1. Unseal Vault if necessary
echo "[1/7] Unsealing Vault..."
echo
for ((i=1; i<=VAULT_KEY_THRESHOLD; i++)); do
    KEY_VAR="VAULT_UNSEAL_KEY_${i}"
    KEY_VALUE="${!KEY_VAR}"

    if [ -z "$KEY_VALUE" ]; then
        echo "Unseal key $i is not set. Please provide the unseal key."
        read -s -p "Enter unseal key $i: " KEY_VALUE
        echo
    fi

    echo "Unsealing with key $((i))..."
    SEALED=$(curl --silent --fail --request POST \
        --data "{\"key\":\"$KEY_VALUE\"}" \
        "$VAULT_ADDR/v1/sys/unseal" \
        "${HEADERS[@]}" \ | jq .sealed)
    if [[ "$SEALED" == "false" ]]; then
        echo
        echo "Vault is unsealed."
        break
    fi
    echo
done

if [[ "$SEALED" == "true" ]]; then
    echo "Error unsealing Vault. Please check the unseal keys and threshold."
    exit 1
fi
echo

# 2. Enable AppRole auth method
echo "[2/7] Enabling AppRole auth method..."
curl -s --request POST "${VAULT_ADDR}/v1/sys/auth/approle" \
    "${HEADERS[@]}" \
    --data '{"type": "approle"}' || echo "AppRole may already be enabled."

echo

# 3. Enable KV secrets engine
echo "[3/7] Enabling KV secrets engine at 'secret' path..."
curl -s --request PUT "${VAULT_ADDR}/v1/sys/mounts/secret" \
     "${HEADERS[@]}" \
     --data '{"type":"kv","options":{"version":"2"}}'

echo

# 4. Create custom policy
echo "[4/7] Creating policy for role ${ROLE_NAME}..."
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

# 5. Create AppRole with policies
echo "[5/7] Creating AppRole ${ROLE_NAME}..."
curl -s --request POST "${VAULT_ADDR}/v1/auth/approle/role/${ROLE_NAME}" \
    "${HEADERS[@]}" \
    --data "{\"policies\": \"${ROLE_NAME}-policy\", \"token_type\": \"batch\"}"

echo

# 6. Retrieve role_id
echo "[6/7] Retrieving role_id..."
ROLE_ID=$(curl -s --request GET "${VAULT_ADDR}/v1/auth/approle/role/${ROLE_NAME}/role-id" \
    "${HEADERS[@]}" | jq -r '.data.role_id')

# echo "ROLE_ID: $ROLE_ID"

echo

# 7. Generate secret_id
echo "[7/7] Generating secret_id..."
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
