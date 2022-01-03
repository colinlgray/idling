use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod state;

use instructions::*;
use state::PlantData;

declare_id!("5Xooq9NawThiYdisrAgc6oyPkesS4VbGM6YTw66pVXPj");

#[program]
pub mod idle_plants {
    use super::*;

    pub fn init_plant(ctx: Context<InitPlant>, data: PlantData) -> ProgramResult {
        instructions::init_plant::handler(ctx, data)
    }

    pub fn begin_growing(ctx: Context<BeginGrowing>) -> ProgramResult {
        instructions::begin_growing::handler(ctx)
    }

    pub fn water_planter(ctx: Context<WaterPlanter>) -> ProgramResult {
        instructions::water_planter::handler(ctx)
    }
}
