use anchor_lang::prelude::*;

#[error]
pub enum ErrorCode {
    #[msg("The provided mint authority is not the treasury mint authority")]
    InvalidMintAuthority,

    #[msg("Not enough time has passed to perform a click")]
    ClickNotReady,

    #[msg("The provided clicker was not owned by the signer")]
    InvalidClickerOwner,
}
