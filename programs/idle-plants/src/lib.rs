use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod state;

use instructions::*;
use state::PlantData;

declare_id!("4H8FuFgabDNba1S8KPLjcni2zBGV2GK8DeffDwtU535f");

#[program]
pub mod idle_plants {
    use super::*;

    pub fn init_plant(ctx: Context<InitPlant>, plant_bump: u8, data: PlantData) -> ProgramResult {
        instructions::init_plant::handler(ctx, plant_bump, data)
    }

    pub fn begin_growing(ctx: Context<BeginGrowing>) -> ProgramResult {
        instructions::begin_growing::handler(ctx)
    }

    pub fn water_planter(ctx: Context<WaterPlanter>) -> ProgramResult {
        instructions::water_planter::handler(ctx)
    }

    pub fn harvest_planter(ctx: Context<HarvestPlanter>) -> ProgramResult {
        instructions::harvest_planter::handler(ctx)
    }
}
