use anchor_lang::prelude::*;
use std::mem::size_of;

pub const RECIPE_PREFIX: &[u8] = b"recipe";

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum BuffType {
    Cost,
    Time,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PlanterBuff {
    pub buff_type: BuffType,
    pub percentage: u16,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct RecipeCost {
    pub mint: Pubkey,
    pub amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RecipeData {
    pub water_cost: u64,
    pub costs: Vec<RecipeCost>,
    pub buffs: Vec<PlanterBuff>,
}

impl RecipeData {
    pub fn size(num_costs: usize, num_buffs: usize) -> usize {
        // size of cost * number of costs + vec overhead
        let costs_size = size_of::<Vec<Recipe>>() + (size_of::<RecipeCost>() * num_costs);

        let buffs_size = (size_of::<PlanterBuff>() * num_buffs) + size_of::<Vec<PlanterBuff>>();

        //water_cost + costs
        8 + costs_size + buffs_size
    }
}

#[account]
pub struct Recipe {
    pub mint: Pubkey,
    pub recipe_data: RecipeData,
    pub bump: u8,
}

impl Recipe {
    pub fn size(num_costs: usize, num_buffs: usize) -> usize {
        8 + 1 + 32 + RecipeData::size(num_costs, num_buffs)
    }
}
