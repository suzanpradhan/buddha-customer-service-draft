import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SideViewState {
  toggle: boolean;
}

const initialState: SideViewState = {
  toggle: false,
};

const sideViewSlice = createSlice({
  name: 'sideViewSlice',
  initialState,
  reducers: {
    setSideViewToggle: (state, action: PayloadAction<boolean>) => {
      state.toggle = action.payload;
    },
  },
});

export const { setSideViewToggle } = sideViewSlice.actions;
export default sideViewSlice.reducer;
