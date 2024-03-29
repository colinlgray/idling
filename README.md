# Idling

This is an unfinished idle game built for the Solana Hacker House
This app is currently deployed to devnet and can be found at [https://idling.vercel.app/](https://idling.vercel.app/)

## Running programs on localnet

1. Build projects.
2. Start test validator in new tab
3. Ensure solana CLI is set to localhost
4. Airdrop some SOL to teskey.json
5. Run solana deploy commands with matching keypairs.

```bash
# 1.
anchor build

# 2. (in separate terminal tab)
solana-test-validator

# 3.
solana config set -u localhost

# 4.
solana airdrop 10 $(solana-keygen pubkey ./keypairs/testkey.json)

# 5.
solana program deploy ./target/deploy/idling.so --program-id ./keypairs/idling-keypair.json
solana program deploy ./target/deploy/idle_plants.so --program-id ./keypairs/idle_plants-keypair.json

```

## Running tests against localnet

> NOTE: this will initialize the treasury with settings from ./test/idling.ts. If you need to change treasury settings, delete the `test-ledger` directory and repeat the above instructions

```bash
 anchor test --skip-deploy --skip-local-validator
```
