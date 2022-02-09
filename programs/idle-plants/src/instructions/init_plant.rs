use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use idle_common::AnchorSize;
use idling::state::Treasury;

use crate::state::{Plant, PlantData, PLANT_PREFIX};

#[derive(Accounts)]
#[instruction(plant_bump: u8)]
pub struct InitPlant<'info> {
    #[account(
      init,
      payer = authority,
      space = Plant::SIZE,
      seeds = [PLANT_PREFIX, &plant_mint.key().to_bytes()],
      bump,
    )]
    pub plant: Account<'info, Plant>,

    #[account(
      init, 
      mint::decimals = 0, 
      mint::authority = plant, 
      payer = authority
    )]
    pub plant_mint: Account<'info, Mint>,

    /// The treasury
    #[account(
      has_one = authority,
    )]
    pub treasury: Account<'info, Treasury>,

    /// The authority over the treasury
    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>
}

pub fn handler(ctx: Context<InitPlant>, plant_bump: u8, data: PlantData) -> ProgramResult {
    let plant = &mut ctx.accounts.plant;
    let plant_mint = &ctx.accounts.plant_mint;

    plant.mint = plant_mint.key();
    plant.data = data;
    plant.bump = plant_bump;

    Ok(())
}
