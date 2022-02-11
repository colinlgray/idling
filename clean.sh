rm -rf ./test-ledger

# 1.
anchor build

read -p "Run a test validator in another tabl then press any key to continue... " -n1 -s

echo "DONE"
solana config set -u localhost

# 4.
solana airdrop 10 $(solana-keygen pubkey ./keypairs/testkey.json)

if [[ $PERSONAL_PUBLIC_KEY == "x" ]]; then solana airdrop 10 $PERSONAL_PUBLIC_KEY; else echo "No personal key"; fi



# 5.
solana program deploy ./target/deploy/idling.so --program-id ./keypairs/idling-keypair.json
solana program deploy ./target/deploy/idle_plants.so --program-id ./keypairs/idle_plants-keypair.json
solana program deploy ./target/deploy/leaderboard.so --program-id ./keypairs/leaderboard-keypair.json

anchor test --skip-deploy --skip-local-validator --skip-build
