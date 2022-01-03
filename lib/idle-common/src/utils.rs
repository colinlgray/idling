use anchor_lang::prelude::*;

use std::mem::size_of;

pub trait AnchorSize: Sized {
    const SIZE: usize;
}

impl<T: AnchorSerialize + AnchorDeserialize> AnchorSize for T {
    const SIZE: usize = 8 + size_of::<Self>();
}
