use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;
use state::{PlantData, RecipeData};

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

    pub fn init_recipe(ctx: Context<InitRecipe>, data: RecipeData) -> ProgramResult {
        instructions::init_recipe::handler(ctx, data)
    }

    pub fn create_item<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, CreateItem<'info>>,
    ) -> ProgramResult {
        instructions::create_item::handler(ctx)
    }
}
