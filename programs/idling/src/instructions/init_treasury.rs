use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::{
    errors::ErrorCode,
    id,
    state::{Treasury, MINT_AUTHORITY_PREFIX, TREASURY_PREFIX},
};
use idle_common::AnchorSize;

#[derive(Accounts)]
pub struct InitTreasury<'info> {
    #[account(
    init,
    payer = authority,
    space = Treasury::SIZE,
    seeds = [TREASURY_PREFIX],
    bump
  )]
    pub treasury: Account<'info, Treasury>,

    pub mint: Account<'info, Mint>,

    #[account(mut, signer)]
    pub authority: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitTreasury>) -> ProgramResult {
    let treasury = &mut ctx.accounts.treasury;

    let (mint_authority, bump) =
        Pubkey::find_program_address(&[TREASURY_PREFIX, MINT_AUTHORITY_PREFIX], &id());

    if !ctx.accounts.mint.mint_authority.contains(&mint_authority) {
        return Err(ErrorCode::InvalidMintAuthority.into());
    }

    treasury.mint = ctx.accounts.mint.key();
    treasury.mint_authority = mint_authority;
    treasury.mint_authority_bump = [bump];
    treasury.authority = ctx.accounts.authority.key();

    Ok(())
}
