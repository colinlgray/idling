use anchor_lang::prelude::*;

#[account]
pub struct Leaderboard {
    pub total_burned: u64,
    pub start_timestamp: i64,
    pub end_timestamp: i64,
}
