use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use idling::state::Treasury;

use crate::state::{Planter, Recipe};

#[derive(Accounts)]
pub struct ApplyItemPlanter<'info> {
    pub owner: Signer<'info>,

    #[account(mut)]
    pub planter: Account<'info, Planter>,

    pub treasury: Account<'info, Treasury>,

    pub item: Account<'info, Recipe>,

    pub item_mint: Account<'info, Mint>,

    pub player_item_tokens: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ApplyItemPlanter>) -> ProgramResult {
    Ok(())
}
