use anchor_lang::prelude::*;

pub const TREASURY_PREFIX: &[u8] = b"treasury";
pub const MINT_AUTHORITY_PREFIX: &[u8] = b"mint";

#[account]
pub struct Treasury {
    /// The token for the treasury
    pub mint: Pubkey,
    /// The PDA allowed to mint treasury tokens
    pub mint_authority: Pubkey,
    pub mint_authority_bump: [u8; 1],
    /// The authority over the treasury
    pub authority: Pubkey,
}

impl Treasury {
    pub fn authority_seeds(&self) -> [&[u8]; 3] {
        [
            TREASURY_PREFIX.as_ref(),
            MINT_AUTHORITY_PREFIX.as_ref(),
            &self.mint_authority_bump,
        ]
    }
}
