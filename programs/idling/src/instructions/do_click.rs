use anchor_lang::prelude::*;
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};

use crate::errors::ErrorCode;
use crate::state::{
    Clicker, Treasury, CLICK_REWARD, COOLDOWN, MINT_AUTHORITY_PREFIX, TREASURY_PREFIX,
};

#[derive(Accounts)]
pub struct DoClick<'info> {
    #[account(signer)]
    pub owner: AccountInfo<'info>,
    #[account(
      mut,
      has_one = owner,
    )]
    pub clicker: Account<'info, Clicker>,
    #[account(
      seeds = [TREASURY_PREFIX],
      bump
    )]
    pub treasury: Account<'info, Treasury>,
    #[account(
      seeds = [TREASURY_PREFIX, MINT_AUTHORITY_PREFIX],
      bump = treasury.mint_authority_bump[0]
    )]
    pub treasury_mint_authority: AccountInfo<'info>,
    #[account(mut)]
    pub treasury_mint: Account<'info, Mint>,
    #[account(mut)]
    pub reward_dest: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

impl<'info> DoClick<'info> {
    pub fn grant_reward_context(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            MintTo {
                mint: self.treasury_mint.to_account_info(),
                to: self.reward_dest.to_account_info(),
                authority: self.treasury_mint_authority.to_account_info(),
            },
        )
    }
}

pub fn handler(ctx: Context<DoClick>) -> ProgramResult {
    let clicker = &mut ctx.accounts.clicker;
    let treasury = &ctx.accounts.treasury;

    let now = Clock::get()?.unix_timestamp;
    let elapsed = now.saturating_sub(clicker.last_redeemed);

    if elapsed < COOLDOWN {
        msg!("Attempted to claim rewards too quickly");
        return Err(ErrorCode::ClickNotReady.into());
    }

    clicker.last_redeemed = now;

    mint_to(
        ctx.accounts
            .grant_reward_context()
            .with_signer(&[&treasury.authority_seeds()]),
        CLICK_REWARD,
    )?;

    Ok(())
}
