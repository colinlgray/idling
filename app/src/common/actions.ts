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

export async function doClick() {
  // await program.rpc.doClick({
  //     accounts: {
  //       owner: playerWallet.publicKey,
  //       clicker: playerClicker,
  //       treasury,
  //       treasuryMintAuthority,
  //       treasuryMint: treasuryMint.publicKey,
  //       rewardDest: playerRewardDest,
  //       tokenProgram,
  //       systemProgram,
  //       associatedTokenProgram,
  //       rent,
  //     },
  //     signers: [playerWallet],
  //   });
  //   let playerRewardDestAcct =
  //     await treasuryMint.getOrCreateAssociatedAccountInfo(
  //       playerWallet.publicKey
  //     );
  return null;
}
