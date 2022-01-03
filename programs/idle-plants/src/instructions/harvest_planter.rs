use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, MintTo, Token, TokenAccount};

use crate::errors::IdlePlantsError;
use crate::state::{Plant, Planter, PLANTER_PREFIX};

#[derive(Accounts)]
pub struct HarvestPlanter<'info> {
    #[account(
      mut,
      seeds = [PLANTER_PREFIX, &plant.key().to_bytes(), &owner.key().to_bytes()],
      bump,
      has_one = owner @ IdlePlantsError::PlanterNotOwned,
      has_one = plant @ IdlePlantsError::InvalidPlantForPlanter,
      close = owner
    )]
    pub planter: Account<'info, Planter>,
    /// The owner of the planter
    #[account(mut, signer)]
    pub owner: AccountInfo<'info>,
    /// The plant being harvested
    pub plant: Account<'info, Plant>,
    /// The mint for the plant
    #[account(mut)]
    pub plant_mint: Account<'info, Mint>,

    /// The account to mint the plant tokens to
    #[account(
      mut,
      constraint = harvest_dest.mint == plant.mint.key() @ IdlePlantsError::InvalidPlantTokenAccount,
      constraint = harvest_dest.owner == owner.key() @ IdlePlantsError::PlantTokenAccountNotOwned
    )]
    pub harvest_dest: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

impl<'info> HarvestPlanter<'info> {
    pub fn mint_harvest_ctx(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            MintTo {
                mint: self.plant_mint.to_account_info(),
                to: self.harvest_dest.to_account_info(),
                authority: self.plant.to_account_info(),
            },
        )
    }
}

pub fn handler(ctx: Context<HarvestPlanter>) -> ProgramResult {
    let plant = &ctx.accounts.plant;
    let planter = &ctx.accounts.planter;

    //TODO: figure out random number of plants to award

    Ok(())
}
