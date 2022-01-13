// [treasury] = await web3.PublicKey.findProgramAddress(
//     [Buffer.from("treasury")],
//     program.programId
//   );

//   [treasuryMintAuthority, treasuryMintAuthorityBump] =
//     await web3.PublicKey.findProgramAddress(
//       [Buffer.from("treasury"), Buffer.from("mint")],
//       program.programId
//     );

//   treasuryMint = await splToken.Token.createMint(
//     provider.connection,
//     treasuryAuthority,
//     treasuryMintAuthority,
//     null,
//     3,
//     splToken.TOKEN_PROGRAM_ID
//   );

// playerRewardDest = await treasuryMint.getOrCreateAssociatedAccountInfo(
//     playerWallet.publicKey
//   );

//   [playerClicker] = await web3.PublicKey.findProgramAddress(
//     [Buffer.from("clicker"), playerWallet.publicKey.toBuffer()],
//     program.programId
//   );

// await program.rpc.initTreasury({
//     accounts: {
//       treasury,
//       mint: treasuryMint.publicKey,
//       authority: treasuryAuthority.publicKey,
//       systemProgram,
//     },
//   });

// await program.rpc.initClicker({
//     accounts: {
//       clicker: playerClicker,
//       owner: playerWallet.publicKey,
//       systemProgram,
//     },
//     signers: [playerWallet],
//   });

// await program.rpc.doClick({
//     accounts: {
//       owner: playerWallet.publicKey,
//       clicker: playerClicker,
//       treasury,
//       treasuryMintAuthority,
//       treasuryMint: treasuryMint.publicKey,
//       rewardDest: playerRewardDest.address,
//       tokenProgram,
//     },
//     signers: [playerWallet],
//   });
export {};
