use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount};
use idle_common::AnchorSize;
use idle_plants::state::Plant;

use crate::errors::LeaderboardError;
use crate::state::{Entry, Leaderboard};

#[derive(Accounts)]
pub struct SubmitPlant<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(mut)]
    pub leaderboard: Account<'info, Leaderboard>,

    #[account(
      init_if_needed,
      payer = owner,
      space = Entry::SIZE,
      seeds = [&leaderboard.key().to_bytes(), &owner.key().to_bytes()],
      bump,
    )]
    pub entry: Account<'info, Entry>,

    pub plant: Account<'info, Plant>,

    #[account(
      mut,
      constraint = plant_mint.key() == plant_token_account.mint @ LeaderboardError::InvalidMintForPlant,
    )]
    pub plant_mint: Account<'info, Mint>,

    #[account(
      mut,
      has_one = owner @ LeaderboardError::TokenAccountNotOwned,
      constraint = plant.mint == plant_token_account.mint @ LeaderboardError::InvalidTokenAccountForPlant,
    )]
    pub plant_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> SubmitPlant<'info> {
    pub fn burn_ctx(&self) -> CpiContext<'_, '_, '_, 'info, Burn<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Burn {
                mint: self.plant_mint.to_account_info(),
                to: self.plant_token_account.to_account_info(),
                authority: self.owner.to_account_info(),
            },
        )
    }
}

pub fn handler(ctx: Context<SubmitPlant>, amount: u64) -> ProgramResult {
    //burn tokens
    token::burn(ctx.accounts.burn_ctx(), amount)?;

    let leaderboard = &mut ctx.accounts.leaderboard;
    let entry = &mut ctx.accounts.entry;
    let plant = &ctx.accounts.plant;
    let owner = &ctx.accounts.owner;

    // if the entry isn't initialized, initialize fields
    if !entry.initialized {
        entry.initialized = true;
        entry.leaderboard = leaderboard.key();
        entry.owner = ctx.accounts.owner.key();
        entry.share = 0;
    } else {
        if entry.owner != owner.key() {
            return Err(LeaderboardError::EntryNotOwned.into());
        }
    }

    //calculate value
    let value = plant.data.worth * amount;

    //increase entry
    entry.share = entry.share.saturating_add(value);

    //increase leaderboard
    leaderboard.total_burned = leaderboard.total_burned.saturating_add(value);

    Ok(())
}
