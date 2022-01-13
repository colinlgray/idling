use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};
use idle_common::random;

use crate::errors::IdlePlantsError;
use crate::id;
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
        init_if_needed,
        associated_token::mint = plant_mint,
        associated_token::authority = owner,
        payer = owner,
    )]
    pub harvest_dest: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
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
    let owner = &ctx.accounts.owner;
    let plant = &ctx.accounts.plant;
    let planter = &ctx.accounts.planter;

    if planter.times_watered < plant.data.required_waterings {
        return Err(IdlePlantsError::PlantNotGrown.into());
    }

    let now = Clock::get()?.unix_timestamp;
    let elapsed = now.saturating_sub(planter.last_watered);

    if elapsed < plant.data.time_till_thirsty {
        return Err(IdlePlantsError::PlantNotGrown.into());
    }

    let (harvest_entropy, _) = Pubkey::find_program_address(
        &[
            &owner.key().to_bytes(),
            &plant.key().to_bytes(),
            &planter.key().to_bytes(),
            &now.to_le_bytes(),
            &planter.created_at.to_le_bytes(),
        ],
        &id(),
    );

    let rewards = random(
        &[
            &harvest_entropy.to_bytes(),
            &planter.entropy,
            &now.to_le_bytes(),
            &planter.created_at.to_le_bytes(),
        ],
        plant.data.min_growth,
        plant.data.max_growth,
    );

    mint_to(ctx.accounts.mint_harvest_ctx(), rewards)?;

    Ok(())
}
