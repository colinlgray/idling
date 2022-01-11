import * as anchor from "@project-serum/anchor";
import { Program, web3 } from "@project-serum/anchor";
import { Idling } from "../target/types/idling";
import * as splToken from "@solana/spl-token";
import { expect } from "chai";

const systemProgram = web3.SystemProgram.programId;
const tokenProgram = splToken.TOKEN_PROGRAM_ID;
const associatedTokenProgram = splToken.ASSOCIATED_TOKEN_PROGRAM_ID;
const rent = web3.SYSVAR_RENT_PUBKEY;

describe("idling", () => {
  const treasuryAuthority = web3.Keypair.generate();

  let provider = anchor.Provider.env();
  provider = new anchor.Provider(
    provider.connection,
    new anchor.Wallet(treasuryAuthority),
    provider.opts
  );
  anchor.setProvider(provider);

  const airdrop = async (address: web3.PublicKey, amount: number) => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        address,
        amount * web3.LAMPORTS_PER_SOL
      ),
      "confirmed"
    );
  };

  const program = anchor.workspace.Idling as Program<Idling>;

  let treasury: web3.PublicKey;
  let treasuryMintAuthority: web3.PublicKey;
  let treasuryMint: splToken.Token;

  const playerWallet = web3.Keypair.generate();
  let playerClicker: web3.PublicKey;
  let playerRewardDest: web3.PublicKey;

  before(async () => {
    await airdrop(treasuryAuthority.publicKey, 10);
    await airdrop(playerWallet.publicKey, 10);

    [treasury] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("treasury")],
      program.programId
    );

    [treasuryMintAuthority] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("treasury"), Buffer.from("mint")],
      program.programId
    );

    treasuryMint = await splToken.Token.createMint(
      provider.connection,
      treasuryAuthority,
      treasuryMintAuthority,
      null,
      3,
      splToken.TOKEN_PROGRAM_ID
    );

    playerRewardDest = await splToken.Token.getAssociatedTokenAddress(
      associatedTokenProgram,
      tokenProgram,
      treasuryMint.publicKey,
      playerWallet.publicKey
    );

    // playerRewardDest = await treasuryMint.getOrCreateAssociatedAccountInfo(
    //   playerWallet.publicKey
    // );

    [playerClicker] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("clicker"), playerWallet.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initializes the treasury", async () => {
    await program.rpc.initTreasury({
      accounts: {
        treasury,
        mint: treasuryMint.publicKey,
        authority: treasuryAuthority.publicKey,
        systemProgram,
      },
    });
  });

  it("creates the player accounts on the first click", async () => {
    await program.rpc.doClick({
      accounts: {
        owner: playerWallet.publicKey,
        clicker: playerClicker,
        treasury,
        treasuryMintAuthority,
        treasuryMint: treasuryMint.publicKey,
        rewardDest: playerRewardDest,
        tokenProgram,
        systemProgram,
        associatedTokenProgram,
        rent,
      },
      signers: [playerWallet],
    });
    let playerRewardDestAcct =
      await treasuryMint.getOrCreateAssociatedAccountInfo(
        playerWallet.publicKey
      );
    expect(playerRewardDestAcct.amount.eqn(0), "player account has 0 tokens").to
      .be.true;
  });

  it("prevents rewards from being claimed too quickly", async () => {
    let err;
    try {
      await program.rpc.doClick({
        accounts: {
          owner: playerWallet.publicKey,
          clicker: playerClicker,
          treasury,
          treasuryMintAuthority,
          treasuryMint: treasuryMint.publicKey,
          rewardDest: playerRewardDest,
          tokenProgram,
          associatedTokenProgram,
          systemProgram,
          rent,
        },
        signers: [playerWallet],
      });
    } catch (error) {
      console.log(error);
      err = error;
    }
    expect(err, "transaction should have failed").to.not.be.null;
    let playerRewardDestAcct =
      await treasuryMint.getOrCreateAssociatedAccountInfo(
        playerWallet.publicKey
      );
    console.log(playerRewardDestAcct.amount.toString());
    expect(playerRewardDestAcct.amount.eqn(0), "player acccount has 0 tokens")
      .to.be.true;
  });

  it("rewards after the time has passed", async () => {
    console.log("sleeping 3 seconds to ensure click is available");
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    let err;
    try {
      await program.rpc.doClick({
        accounts: {
          owner: playerWallet.publicKey,
          clicker: playerClicker,
          treasury,
          treasuryMintAuthority,
          treasuryMint: treasuryMint.publicKey,
          rewardDest: playerRewardDest,
          tokenProgram,
          associatedTokenProgram,
          systemProgram,
          rent,
        },
        signers: [playerWallet],
      });
    } catch (error) {
      console.log(error);
      err = error;
    }
    expect(err).to.not.be.null;
    let playerRewardDestAcct =
      await treasuryMint.getOrCreateAssociatedAccountInfo(
        playerWallet.publicKey
      );
    console.log(playerRewardDestAcct.amount.toString());
    expect(playerRewardDestAcct.amount.eqn(50), "player account has 50 tokens")
      .to.be.true;
  });
});
