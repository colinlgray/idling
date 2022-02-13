use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};

use idle_common::AnchorSize;

use crate::errors::ErrorCode;
use crate::state::{
    Clicker, Treasury, CLICKER_PREFIX, CLICK_REWARD, COOLDOWN, MINT_AUTHORITY_PREFIX,
    TREASURY_PREFIX,
};

#[derive(Accounts)]
pub struct DoClick<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init_if_needed,
        payer = owner,
        space = Clicker::SIZE,
        seeds = [CLICKER_PREFIX, &owner.key().to_bytes()],
        bump,
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

    #[account(
        init_if_needed,
        associated_token::mint = treasury_mint,
        associated_token::authority = owner,
        payer = owner,
    )]
    pub reward_dest: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
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
    let owner = &ctx.accounts.owner;
    let clicker = &mut ctx.accounts.clicker;
    let treasury = &ctx.accounts.treasury;
    let now = Clock::get()?.unix_timestamp;

    if !clicker.is_initialized {
        clicker.owner = ctx.accounts.owner.key();
        clicker.last_redeemed = now;
        clicker.is_initialized = true;
    } else {
        if clicker.owner != owner.key() {
            return Err(ErrorCode::InvalidClickerOwner.into());
        }

        let elapsed = now.saturating_sub(clicker.last_redeemed);

        if elapsed < COOLDOWN {
            msg!("Attempted to claim rewards too quickly");
            return Err(ErrorCode::ClickNotReady.into());
        }
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
