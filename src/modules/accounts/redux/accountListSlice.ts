import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AccountDetailType } from '../data/accountTypes';

export interface AccountListState {
  accounts: AccountDetailType[];
}

const initialState: AccountListState = {
  accounts: [],
};

const testSlice = createSlice({
  name: 'accountSlice',
  initialState,
  reducers: {
    setAccountListData: (state, action: PayloadAction<AccountDetailType[]>) => {
      state.accounts = action.payload;
    },
  },
});

export const { setAccountListData } = testSlice.actions;
export default testSlice.reducer;
