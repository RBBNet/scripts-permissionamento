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

# Customize number of key shares and threshold
KEY_SHARES="${VAULT_KEY_SHARES:-3}"
KEY_THRESHOLD="${VAULT_KEY_THRESHOLD:-2}"

# Initialize Vault
response=$(curl --silent --request PUT \
  --data "{\"secret_shares\": $KEY_SHARES, \"secret_threshold\": $KEY_THRESHOLD}" \
  "$VAULT_ADDR/v1/sys/init")

# Check for errors
if echo "$response" | grep -q "errors"; then
  echo "Vault init failed:"
  echo "$response"
  exit 1
fi

# Parse and show unseal keys and root token
echo "Vault initialized successfully."
echo "$response" | jq .
