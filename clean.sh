rm -rf ./test-ledger

# 1.
anchor build

read -p "Run a test validator in another tabl then press any key to continue... " -n1 -s

echo "DONE"
solana config set -u localhost

# 4.
solana airdrop 10 $(solana-keygen pubkey ./testkey.json)

# 5.
solana program deploy ./target/deploy/idling.so --program-id ./idling-keypair.json
solana program deploy ./target/deploy/idle_plants.so --program-id ./idle_plants-keypair.json

anchor test --skip-deploy --skip-local-validator
