use anchor_lang::solana_program::keccak;
use spl_math::uint::U256;

pub fn random(entropy: &[&[u8]], max: u64) -> u64 {
    let mut rand: U256 = keccak::hashv(entropy).0.into();
    rand %= max;
    rand.as_u64()
}
