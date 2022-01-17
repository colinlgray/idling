use anchor_lang::prelude::*;
use instructions::*;

pub mod errors;
pub mod instructions;
pub mod state;

declare_id!("3gTqaTAKfq6h41XDSFb2iUZt8bXFKTpbU3nsxbBzipcN");

#[program]
pub mod idling {
    use super::*;

    pub fn init_treasury(ctx: Context<InitTreasury>) -> ProgramResult {
        instructions::init_treasury::handler(ctx)
    }

    pub fn init_clicker(ctx: Context<InitClicker>) -> ProgramResult {
        instructions::init_clicker::handler(ctx)
    }

    pub fn do_click(ctx: Context<DoClick>) -> ProgramResult {
        instructions::do_click::handler(ctx)
    }
}
