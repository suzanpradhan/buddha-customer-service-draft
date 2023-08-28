import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface TestState {
  data: string;
}

const initialState: TestState = {
  data: '',
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<string>) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = testSlice.actions;
export default testSlice.reducer;
