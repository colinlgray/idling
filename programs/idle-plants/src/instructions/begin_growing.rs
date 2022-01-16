use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount};
use idle_common::AnchorSize;
use idling::state::Treasury;

use crate::errors::IdlePlantsError;
use crate::id;
use crate::state::{Plant, Planter, PLANTER_PREFIX};

#[derive(Accounts)]
pub struct BeginGrowing<'info> {
    #[account(
      init,
      payer = owner,
      space = Planter::SIZE,
      seeds = [PLANTER_PREFIX, &plant.key().to_bytes(), &owner.key().to_bytes()],
      bump
    )]
    pub planter: Account<'info, Planter>,
    /// The owner of the clicker
    #[account(mut)]
    pub owner: Signer<'info>,
    /// The plant being planted
    pub plant: Account<'info, Plant>,

    pub treasury: Account<'info, Treasury>,

    #[account(
      mut,
      address = treasury.mint
    )]
    pub treasury_mint: Account<'info, Mint>,

    #[account(
      mut,
      constraint = treasury_tokens.mint == treasury_mint.key() @ IdlePlantsError::InvalidTreasuryTokenAccount,
      constraint = treasury_tokens.owner == owner.key() @ IdlePlantsError::TreasuryTokenAccountNotOwned
    )]
    pub treasury_tokens: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> BeginGrowing<'info> {
    pub fn burn_cost_ctx(&self) -> CpiContext<'_, '_, '_, 'info, Burn<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Burn {
                mint: self.treasury_mint.to_account_info(),
                to: self.treasury_tokens.to_account_info(),
                authority: self.owner.to_account_info(),
            },
        )
    }
}

pub fn handler(ctx: Context<BeginGrowing>) -> ProgramResult {
    let planter = &mut ctx.accounts.planter;
    let plant = &ctx.accounts.plant;
    let owner = &ctx.accounts.owner;

    let now = Clock::get()?.unix_timestamp;

    let (entropy, _) = Pubkey::find_program_address(
        &[
            &owner.key().to_bytes(),
            &plant.key().to_bytes(),
            &planter.key().to_bytes(),
            &now.to_le_bytes(),
        ],
        &id(),
    );

    planter.owner = owner.key();
    planter.plant = plant.key();
    planter.times_watered = 0;
    planter.created_at = now;
    planter.last_watered = now;
    planter.entropy = entropy.to_bytes();

    token::burn(ctx.accounts.burn_cost_ctx(), plant.data.cost)?;

    Ok(())
}
