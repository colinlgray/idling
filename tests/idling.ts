import * as anchor from "@project-serum/anchor";
import { Program, web3 } from "@project-serum/anchor";
import { Idling } from "../target/types/idling";
import * as splToken from "@solana/spl-token";
import { expect } from "chai";

const systemProgram = web3.SystemProgram.programId;
const tokenProgram = splToken.TOKEN_PROGRAM_ID;

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
  let treasuryMintAuthorityBump: number;
  let treasuryMint: splToken.Token;

  const playerWallet = web3.Keypair.generate();
  let playerClicker: web3.PublicKey;
  let playerRewardDest: splToken.AccountInfo;

  before(async () => {
    await airdrop(treasuryAuthority.publicKey, 10);
    await airdrop(playerWallet.publicKey, 10);

    [treasury] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("treasury")],
      program.programId
    );

    [treasuryMintAuthority, treasuryMintAuthorityBump] =
      await web3.PublicKey.findProgramAddress(
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

    playerRewardDest = await treasuryMint.getOrCreateAssociatedAccountInfo(
      playerWallet.publicKey
    );

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

  it("Initializes a clicker for a player", async () => {
    await program.rpc.initClicker({
      accounts: {
        clicker: playerClicker,
        owner: playerWallet.publicKey,
        systemProgram,
      },
      signers: [playerWallet],
    });
  });

  it("grants the rewards for a player click", async () => {
    console.log("sleeping 3 seconds to ensure click is available");
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    await program.rpc.doClick({
      accounts: {
        owner: playerWallet.publicKey,
        clicker: playerClicker,
        treasury,
        treasuryMintAuthority,
        treasuryMint: treasuryMint.publicKey,
        rewardDest: playerRewardDest.address,
        tokenProgram,
      },
      signers: [playerWallet],
    });
    playerRewardDest = await treasuryMint.getOrCreateAssociatedAccountInfo(
      playerWallet.publicKey
    );
    expect(playerRewardDest.amount.eqn(50)).to.be.true;
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
          rewardDest: playerRewardDest.address,
          tokenProgram,
        },
        signers: [playerWallet],
      });
    } catch (error) {
      console.log(error);
      err = error;
    }
    expect(err).to.not.be.null;
    playerRewardDest = await treasuryMint.getOrCreateAssociatedAccountInfo(
      playerWallet.publicKey
    );
    console.log(playerRewardDest.amount.toString());
    expect(playerRewardDest.amount.eqn(50)).to.be.true;
  });
});
