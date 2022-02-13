use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use idling::state::Treasury;

use crate::state::{Recipe, RecipeData, RECIPE_PREFIX};
use crate::errors::IdlePlantsError;

#[derive(Accounts)]
#[instruction(data: RecipeData)]
pub struct InitRecipe<'info> {
    #[account(
      init,
      payer = authority,
      space = Recipe::size(data.costs.len(), data.buffs.len()),
      seeds = [RECIPE_PREFIX, &item_mint.key().to_bytes()],
      bump,
    )]
    pub recipe: Account<'info, Recipe>,

    #[account(
      init, 
      mint::decimals = 0, 
      mint::authority = recipe, 
      payer = authority
    )]
    pub item_mint: Account<'info, Mint>,

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
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<InitRecipe>, data: RecipeData) -> ProgramResult {

  let recipe = &mut ctx.accounts.recipe;
  let item_mint = &ctx.accounts.item_mint;

  let invalid_buff = data.buffs.iter().find(|buff| buff.percentage > 10000);
  if invalid_buff.is_some() {
    return Err(IdlePlantsError::InvalidBuffPercentage.into());
  }

  recipe.recipe_data = data;
  recipe.bump = *ctx.bumps.get("recipe").ok_or(IdlePlantsError::MissingBump)?;
  recipe.mint = item_mint.key();


  Ok(())
}
