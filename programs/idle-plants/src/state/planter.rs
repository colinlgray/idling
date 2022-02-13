use std::mem::size_of;

use anchor_lang::prelude::*;

use super::PlanterBuff;

pub const PLANTER_PREFIX: &[u8] = b"planter";

#[account]
pub struct Planter {
    /// The owner of the planter
    pub owner: Pubkey,
    /// The type of plant in the planter
    pub plant: Pubkey,
    /// The number of times this planter has been watered
    pub times_watered: u8,
    /// The timestamp this planter was created
    pub created_at: i64,
    /// The timestamp of the last watering
    pub last_watered: i64,
    /// bytes to use as seeds to hashing function
    pub entropy: [u8; 32],

    pub active_buffs: Vec<PlanterBuff>,
}

impl Planter {
    pub const SIZE: usize = 8 + size_of::<Planter>() + (10 * size_of::<PlanterBuff>());
}
