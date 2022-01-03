use anchor_lang::prelude::*;

use crate::state::{Clicker, CLICKER_PREFIX};
use idle_common::AnchorSize;

#[derive(Accounts)]
pub struct InitClicker<'info> {
    #[account(
    init,
    payer = owner,
    space = Clicker::SIZE,
    seeds = [CLICKER_PREFIX, &owner.key().to_bytes()],
    bump
  )]
    pub clicker: Account<'info, Clicker>,
    #[account(mut, signer)]
    pub owner: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitClicker>) -> ProgramResult {
    let clicker = &mut ctx.accounts.clicker;

    let now = Clock::get()?.unix_timestamp;

    clicker.owner = ctx.accounts.owner.key();
    clicker.last_redeemed = now;

    Ok(())
}
