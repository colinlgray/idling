use anchor_lang::prelude::*;

pub const ENTRY_PREFIX: &[u8] = b"entry";

#[account]
pub struct Entry {
    pub leaderboard: Pubkey,
    pub owner: Pubkey,
    pub share: u64,
    pub initialized: bool,
}
