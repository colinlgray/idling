use anchor_lang::prelude::*;

#[error]
pub enum IdlePlantsError {
    #[msg("The provided mint does not have the plant PDA as mint authority")]
    InvalidPlantMint,

    #[msg("The provided token account is not for the treasury mint")]
    InvalidTreasuryTokenAccount,

    #[msg("The provided token account is not owned by this user")]
    TreasuryTokenAccountNotOwned,

    #[msg("The provided planter is not owned by this user")]
    PlanterNotOwned,

    #[msg("The provided planter does not contain the provided plant")]
    InvalidPlantForPlanter,

    #[msg("The plant in the planter is not ready to be watered yet")]
    PlantNotThirsty,

    #[msg("The plant in the planter does not need to be watered again")]
    PlantAtMaxWaterings,

    #[msg("The provided token account is not for the plant in the planter")]
    InvalidPlantTokenAccount,

    #[msg("The provided token account is not owned by this user")]
    PlantTokenAccountNotOwned,

    #[msg("The provided plant has not reached it's required watering and time yet")]
    PlantNotGrown,
}
