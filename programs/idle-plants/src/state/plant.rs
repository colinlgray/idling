use anchor_lang::prelude::*;

pub const PLANT_PREFIX: &[u8] = b"plant";

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PlantData {
    /// The maximum yield this plant can award upon completion
    pub max_growth: u64,
    /// The number of waterings the plant needs to be fully grown
    pub required_waterings: u8,
    /// Time until the plant can be watered again
    pub time_till_thirsty: i64,
    /// Cost to begin growing the plant
    pub cost: u64,
    /// What the plant is worth in a leaderboard per atomic unit
    pub worth: u64,
}

#[account]
pub struct Plant {
    /// The token for this plant
    pub mint: Pubkey,
    pub data: PlantData,
    pub bump: u8,
}
