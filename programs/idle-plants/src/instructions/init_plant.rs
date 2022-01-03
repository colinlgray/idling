use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use idle_common::AnchorSize;
use idling::state::Treasury;

use crate::errors::IdlePlantsError;
use crate::state::{Plant, PlantData, PLANT_PREFIX};

#[derive(Accounts)]
pub struct InitPlant<'info> {
    #[account(
      init,
      payer = authority,
      space = Plant::SIZE,
      seeds = [PLANT_PREFIX, &plant_mint.key().to_bytes()],
      bump
    )]
    pub plant: Account<'info, Plant>,

    #[account(
      constraint = plant_mint.mint_authority.contains(&plant.key()) @ IdlePlantsError::InvalidPlantMint
    )]
    pub plant_mint: Account<'info, Mint>,

    /// The treasury
    #[account(
      has_one = authority,
    )]
    pub treasury: Account<'info, Treasury>,

    /// The authority over the treasury
    #[account(mut, signer)]
    pub authority: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitPlant>, data: PlantData) -> ProgramResult {
    let plant = &mut ctx.accounts.plant;
    let plant_mint = &ctx.accounts.plant_mint;

    plant.mint = plant_mint.key();
    plant.data = data;

    Ok(())
}
