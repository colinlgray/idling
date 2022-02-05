import * as anchor from "@project-serum/anchor";
import { Program, web3 } from "@project-serum/anchor";
import { Idling } from "../target/types/idling";
import * as splToken from "@solana/spl-token";
import { expect } from "chai";
import {
  treasuryKeypair,
  plantMintKeypairs,
  airdrop,
  sleep,
  playerKeypair,
} from "./common";
import { IdlePlants } from "../target/types/idle_plants";

const systemProgram = web3.SystemProgram.programId;
const tokenProgram = splToken.TOKEN_PROGRAM_ID;
const associatedTokenProgram = splToken.ASSOCIATED_TOKEN_PROGRAM_ID;
const rent = web3.SYSVAR_RENT_PUBKEY;

const idling = anchor.workspace.Idling as Program<Idling>;
const idlePlants = anchor.workspace.IdlePlants as Program<IdlePlants>;

const treasuryAuthority = treasuryKeypair;
let provider = anchor.Provider.env();

let treasury: web3.PublicKey;
let treasuryMintAuthority: web3.PublicKey;
let treasuryMint: splToken.Token;

const playerWallet = playerKeypair;
let playerClicker: web3.PublicKey;
let playerRewardDest: web3.PublicKey;
let playerTestPlantPlanter: web3.PublicKey;
let playerTestPlantRewardDest: web3.PublicKey;

const testPlantMintKeypair = plantMintKeypairs[0];
let testPlantMint: splToken.Token;
let testPlants: { plant: web3.PublicKey; bump: number }[];
let testPlant: web3.PublicKey;
let testPlantBump: number;

describe("idling", () => {
  before(async () => {
    await airdrop(treasuryAuthority.publicKey, 10);
    await airdrop(playerWallet.publicKey, 10);

    [treasury] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("treasury")],
      idling.programId
    );

    [treasuryMintAuthority] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("treasury"), Buffer.from("mint")],
      idling.programId
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

    [playerClicker] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("clicker"), playerWallet.publicKey.toBuffer()],
      idling.programId
    );
  });

  it("Initializes the treasury", async () => {
    await idling.rpc.initTreasury({
      accounts: {
        treasury,
        mint: treasuryMint.publicKey,
        authority: treasuryAuthority.publicKey,
        systemProgram,
      },
    });
  });

  it("creates the player accounts on the first click", async () => {
    await idling.rpc.doClick({
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
      await idling.rpc.doClick({
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
    await sleep(3000);
    let err;
    try {
      await idling.rpc.doClick({
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

describe("idle-plants", () => {
  const plantData = [
    {
      maxGrowth: new anchor.BN(20),
      requiredWaterings: 1,
      timeTillThirsty: new anchor.BN(2),
      cost: new anchor.BN(50),
    },
    {
      maxGrowth: new anchor.BN(60),
      requiredWaterings: 3,
      timeTillThirsty: new anchor.BN(6),
      cost: new anchor.BN(100),
    },
    {
      maxGrowth: new anchor.BN(300),
      requiredWaterings: 5,
      timeTillThirsty: new anchor.BN(10),
      cost: new anchor.BN(500),
    },
    {
      maxGrowth: new anchor.BN(2000),
      requiredWaterings: 10,
      timeTillThirsty: new anchor.BN(20),
      cost: new anchor.BN(5000),
    },
  ];

  before(async () => {
    testPlants = await Promise.all(
      plantData.map(async (_, idx) => {
        const [testPlant, testPlantBump] =
          await web3.PublicKey.findProgramAddress(
            [Buffer.from("plant"), plantMintKeypairs[idx].publicKey.toBuffer()],
            idlePlants.programId
          );
        return {
          plant: testPlant,
          bump: testPlantBump,
        };
      })
    );

    testPlant = testPlants[0].plant;
    testPlantBump = testPlants[0].bump;

    [playerTestPlantPlanter] = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("planter"),
        testPlant.toBuffer(),
        playerWallet.publicKey.toBuffer(),
      ],
      idlePlants.programId
    );

    playerTestPlantRewardDest = await splToken.Token.getAssociatedTokenAddress(
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      splToken.TOKEN_PROGRAM_ID,
      testPlantMintKeypair.publicKey,
      playerWallet.publicKey
    );

    testPlantMint = new splToken.Token(
      provider.connection,
      testPlantMintKeypair.publicKey,
      splToken.TOKEN_PROGRAM_ID,
      playerWallet
    );
  });

  it("creates a plant", async () => {
    await Promise.all(
      plantData.map(async (pData, idx) => {
        const thisPlant = testPlants[idx];
        const thisKeypair = plantMintKeypairs[idx];
        return await idlePlants.rpc.initPlant(thisPlant.bump, pData, {
          accounts: {
            plant: thisPlant.plant,
            plantMint: thisKeypair.publicKey,
            treasury: treasury,
            authority: treasuryAuthority.publicKey,
            systemProgram,
            tokenProgram,
            rent,
          },
          signers: [thisKeypair, treasuryAuthority],
        });
      })
    );
  });

  it("begins growing the test plant", async () => {
    let tx = await idlePlants.rpc.beginGrowing({
      accounts: {
        planter: playerTestPlantPlanter.toBase58(),
        owner: playerWallet.publicKey,
        plant: testPlant,
        treasury,
        treasuryMint: treasuryMint.publicKey,
        treasuryTokens: playerRewardDest,
        tokenProgram,
        systemProgram,
        rent,
      },
      signers: [playerWallet],
    });

    await provider.connection.confirmTransaction(tx, "confirmed");

    //expect the 50 tokens to be withdrawn from the player
    let playerRewardDestAcct =
      await treasuryMint.getOrCreateAssociatedAccountInfo(
        playerWallet.publicKey
      );
    console.log(
      "balance after planting",
      playerRewardDestAcct.amount.toString()
    );
    expect(playerRewardDestAcct.amount.eqn(0), "player account has 0 tokens").to
      .be.true;
  });

  it("prevents immediate watering", async () => {
    let err;
    try {
      await idlePlants.rpc.waterPlanter({
        accounts: {
          planter: playerTestPlantPlanter,
          plant: testPlant,
          owner: playerWallet.publicKey,
        },
        signers: [playerWallet],
      });
    } catch (error) {
      console.log(error);
      err = error;
    }
    expect(err, "expected watering error").to.not.be.null;
  });

  it("prevents harvesting before fully watered", async () => {
    let err;
    try {
      await idlePlants.rpc.harvestPlanter({
        accounts: {
          planter: playerTestPlantPlanter,
          owner: playerWallet.publicKey,
          plant: testPlant,
          plantMint: testPlantMintKeypair.publicKey,
          harvestDest: playerTestPlantRewardDest,
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
    expect(err, "expected harvesting error").to.not.be.null;
  });

  it("allows watering after time till thirsty has passed", async () => {
    console.log("sleeping 3 seconds to ensure watering is available");
    await sleep(3000);

    let tx = await idlePlants.rpc.waterPlanter({
      accounts: {
        planter: playerTestPlantPlanter,
        plant: testPlant,
        owner: playerWallet.publicKey,
      },
      signers: [playerWallet],
    });

    await provider.connection.confirmTransaction(tx, "confirmed");

    let planter = await idlePlants.account.planter.fetch(
      playerTestPlantPlanter
    );
    expect(planter.timesWatered).to.equal(1);
  });

  it("harvests the plant after time till thirsty has passed since fully watered", async () => {
    console.log("sleeping 3 seconds to ensure harvesting is available");
    await sleep(3000);

    let tx = await idlePlants.rpc.harvestPlanter({
      accounts: {
        planter: playerTestPlantPlanter,
        owner: playerWallet.publicKey,
        plant: testPlant,
        plantMint: testPlantMintKeypair.publicKey,
        harvestDest: playerTestPlantRewardDest,
        tokenProgram,
        associatedTokenProgram,
        systemProgram,
        rent,
      },
      signers: [playerWallet],
    });
    await provider.connection.confirmTransaction(tx, "confirmed");

    //planter should be closed to get rent back
    let planter = await idlePlants.account.planter.fetchNullable(
      playerTestPlantPlanter
    );
    expect(planter).to.be.null;

    let playerPlantAcct = await testPlantMint.getOrCreateAssociatedAccountInfo(
      playerWallet.publicKey
    );
    console.log("balance after harvest", playerPlantAcct.amount.toString());
    expect(
      playerPlantAcct.amount.lte(plantData[0].maxGrowth),
      "harvest to be <= maxGrowth"
    ).to.be.true;
  });
});
