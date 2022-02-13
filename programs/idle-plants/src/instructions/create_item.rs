use std::collections::BTreeMap;

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Burn, Mint, MintTo, Token, TokenAccount},
};
use idling::state::Treasury;

use crate::state::{Recipe, RECIPE_PREFIX};
use crate::{errors::IdlePlantsError, state::RecipeCost};

#[derive(Accounts)]
pub struct CreateItem<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    pub recipe: Account<'info, Recipe>,

    #[account(
      mut,
      constraint = item_mint.key() == recipe.mint
    )]
    pub item_mint: Account<'info, Mint>,

    pub treasury: Box<Account<'info, Treasury>>,

    #[account(
      mut,
      address = treasury.mint
    )]
    pub treasury_mint: Box<Account<'info, Mint>>,

    #[account(
      mut,
      constraint = treasury_tokens.mint == treasury_mint.key() @ IdlePlantsError::InvalidTreasuryTokenAccount,
      constraint = treasury_tokens.owner == owner.key() @ IdlePlantsError::TreasuryTokenAccountNotOwned
    )]
    pub treasury_tokens: Box<Account<'info, TokenAccount>>,

    #[account(
      init_if_needed,
      payer = owner,
      associated_token::mint = item_mint,
      associated_token::authority = owner,
    )]
    pub item_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> CreateItem<'info> {
    pub fn burn_water_ctx(&self) -> CpiContext<'_, '_, '_, 'info, Burn<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Burn {
                mint: self.treasury_mint.to_account_info(),
                to: self.treasury_tokens.to_account_info(),
                authority: self.owner.to_account_info(),
            },
        )
    }

    pub fn burn_plant_ctx(
        &self,
        mint: AccountInfo<'info>,
        token_account: AccountInfo<'info>,
    ) -> CpiContext<'_, '_, '_, 'info, Burn<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Burn {
                mint,
                to: token_account,
                authority: self.owner.to_account_info(),
            },
        )
    }

    pub fn mint_item_ctx(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            MintTo {
                mint: self.item_mint.to_account_info(),
                to: self.item_token_account.to_account_info(),
                authority: self.recipe.to_account_info(),
            },
        )
    }
}

pub fn get_plant_cost_accounts<'a, 'b, 'c, 'd>(
    recipe: &'a Recipe,
    accounts: &'b [AccountInfo<'c>],
    owner_pubkey: &'d Pubkey,
) -> Result<Vec<(u64, (Account<'c, Mint>, Account<'c, TokenAccount>))>, ProgramError> {
    let account_info_iter = &mut accounts.iter();

    let mut costs = BTreeMap::new();
    for RecipeCost { mint, amount } in recipe.recipe_data.costs.iter() {
        costs.insert(mint, *amount);
    }
    msg!("looking for plant costs: {:?}", costs);

    // each plant needs a mint and a token account. Mint first
    if account_info_iter.len() != costs.len() * 2 {
        return Err(IdlePlantsError::NotEnoughPlantTokenAccounts.into());
    }

    let mut cost_accounts = Vec::with_capacity(costs.len());

    while let Ok(mint_account_info) = next_account_info(account_info_iter) {
        let plant_mint: Account<Mint> = Account::try_from(mint_account_info)?;
        msg!("found plant mint: {}", plant_mint.key());

        match next_account_info(account_info_iter) {
            Err(_) => {
                return Err(IdlePlantsError::NotEnoughPlantTokenAccounts.into());
            }
            Ok(token_account_info) => {
                let plant_token_account: Account<TokenAccount> =
                    Account::try_from(token_account_info)?;

                msg!(
                    "found token account: {} for mint: {}",
                    plant_token_account.key(),
                    plant_token_account.mint
                );

                if plant_token_account.owner != *owner_pubkey {
                    return Err(IdlePlantsError::PlantTokenAccountNotOwned.into());
                }

                if plant_token_account.mint != plant_mint.key() {
                    msg!("token account not valid for plant");
                    return Err(IdlePlantsError::InvalidTokenAccountForItemCost.into());
                }

                if let Some(cost) = costs.get(&plant_mint.key()) {
                    cost_accounts.push((*cost, (plant_mint, plant_token_account)))
                } else {
                    msg!("Not found in costs");
                    return Err(IdlePlantsError::InvalidTokenAccountForItemCost.into());
                }
            }
        }
    }

    Ok(cost_accounts)
}

pub fn handler<'a, 'b, 'c, 'info>(
    ctx: Context<'a, 'b, 'c, 'info, CreateItem<'info>>,
) -> ProgramResult {
    let recipe = &ctx.accounts.recipe;
    let owner = &ctx.accounts.owner;

    //burn water cost
    msg!("Burning {} water", recipe.recipe_data.water_cost);
    token::burn(ctx.accounts.burn_water_ctx(), recipe.recipe_data.water_cost)?;

    // for each plant cost, burn tokens
    msg!("Reading plant acounts");
    let remaining = ctx.remaining_accounts;
    let costs = get_plant_cost_accounts(recipe, remaining, owner.key)?;
    msg!("Burning plant costs");
    for (cost, (mint, token_account)) in costs.into_iter() {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: mint.to_account_info(),
                to: token_account.to_account_info(),
                authority: owner.to_account_info(),
            },
        );
        token::burn(cpi_ctx, cost)?;
    }

    //mint the item
    msg!("Minting item");
    token::mint_to(
        ctx.accounts.mint_item_ctx().with_signer(&[&[
            RECIPE_PREFIX.as_ref(),
            &recipe.mint.to_bytes(),
            &[recipe.bump][..],
        ]]),
        1,
    )?;

    Ok(())
}
