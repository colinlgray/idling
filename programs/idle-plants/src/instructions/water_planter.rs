use anchor_lang::prelude::*;

use crate::errors::IdlePlantsError;
use crate::state::{Plant, Planter};

#[derive(Accounts)]
pub struct WaterPlanter<'info> {
    #[account(
      mut,
      has_one = owner @ IdlePlantsError::PlanterNotOwned,
      has_one = plant @ IdlePlantsError::InvalidPlantForPlanter
    )]
    pub planter: Account<'info, Planter>,

    pub plant: Account<'info, Plant>,

    #[account(signer)]
    pub owner: AccountInfo<'info>,
}

pub fn handler(ctx: Context<WaterPlanter>) -> ProgramResult {
    let planter = &mut ctx.accounts.planter;
    let plant = &ctx.accounts.plant;

    let now = Clock::get()?.unix_timestamp;
    let elapsed = now.saturating_sub(planter.last_watered);

    if elapsed < plant.data.time_till_thirsty {
        return Err(IdlePlantsError::PlantNotThirsty.into());
    }

    if planter.times_watered == plant.data.required_waterings {
        return Err(IdlePlantsError::PlantAtMaxWaterings.into());
    }

    planter.times_watered += 1;
    planter.last_watered = now;

    Ok(())
}
