use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

pub use errors::*;
pub use instructions::*;
pub use state::*;

declare_id!("4TytLcPefVMwAtTwDwMXBDQQKn1gG8CjejbVVqSouQQ2");

#[program]
pub mod leaderboard {
    use super::*;

    pub fn init_leaderboard(
        ctx: Context<InitLeaderboard>,
        week: String,
        year: String,
        start: i64,
        end: i64,
    ) -> ProgramResult {
        instructions::init_leaderboard::handler(ctx, week, year, start, end)
    }

    pub fn submit_plant(ctx: Context<SubmitPlant>, amount: u64) -> ProgramResult {
        instructions::submit_plant::handler(ctx, amount)
    }
}
