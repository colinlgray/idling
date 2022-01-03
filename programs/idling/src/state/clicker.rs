use anchor_lang::prelude::*;

pub const CLICK_REWARD: u64 = 50;
pub const COOLDOWN: i64 = 2;
pub const CLICKER_PREFIX: &[u8] = b"clicker";

#[account]
pub struct Clicker {
    /// The owner of the clicker
    pub owner: Pubkey,
    /// The last time the owner received their click reward
    pub last_redeemed: i64,
}
