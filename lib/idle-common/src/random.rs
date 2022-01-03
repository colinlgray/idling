use anchor_lang::solana_program::keccak;
use spl_math::uint::U256;

pub fn random(entropy: &[&[u8]], min: u64, max: u64) -> u64 {
    let rand: U256 = keccak::hashv(entropy).0.into();
    let rand = rand % max;
    if rand.le(&U256::from(min)) {
        min
    } else {
        rand.as_u64()
    }
}
