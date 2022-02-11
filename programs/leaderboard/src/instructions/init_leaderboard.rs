use anchor_lang::prelude::*;
use idle_common::AnchorSize;

use crate::errors::LeaderboardError;
use crate::state::Leaderboard;

#[derive(Accounts)]
#[instruction(week:String, year:String)]
pub struct InitLeaderboard<'info> {
    #[account(
    init,
    payer = authority,
    space = Leaderboard::SIZE,
    seeds = [week.as_bytes(), year.as_bytes()],
    bump
  )]
    pub leaderboard: Account<'info, Leaderboard>,

    //TODO: MAKE THIS SECURE
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<InitLeaderboard>,
    _week: String,
    _year: String,
    start: i64,
    end: i64,
) -> ProgramResult {
    let clock = Clock::get()?;

    if start < clock.unix_timestamp {
        return Err(LeaderboardError::InvalidStartTime.into());
    }

    if end < start {
        return Err(LeaderboardError::InvalidEndTime.into());
    }

    let leaderboard = &mut ctx.accounts.leaderboard;

    leaderboard.total_burned = 0;
    leaderboard.start_timestamp = start;
    leaderboard.end_timestamp = end;

    Ok(())
}
