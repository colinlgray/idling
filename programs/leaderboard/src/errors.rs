use anchor_lang::prelude::*;

#[error]
pub enum LeaderboardError {
    #[msg("The provided start time is in the past")]
    InvalidStartTime,

    #[msg("The provided end time is not valid")]
    InvalidEndTime,

    #[msg("The provided mint is not valid for the plant mint")]
    InvalidMintForPlant,

    #[msg("The provided token account is not valid for the plant mint")]
    InvalidTokenAccountForPlant,

    #[msg("The provided token account is not owned by the current user")]
    TokenAccountNotOwned,

    #[msg("The entry is not owned is not owned by the current user")]
    EntryNotOwned,
}
