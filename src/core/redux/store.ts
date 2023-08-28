import { baseApi, baseClientApi } from '@/core/api/apiQuery';
import accountListSlice from '@/modules/accounts/redux/accountListSlice';
import sideViewSlice from '@/modules/sideview/redux/sideViewSlice';
import { configureStore } from '@reduxjs/toolkit';
import { rtkQueryErrorLogger } from '../api/apiMiddleware';

export const store = configureStore({
  reducer: {
    accountSlice: accountListSlice,
    baseApi: baseApi.reducer,
    baseClientApi: baseClientApi.reducer,
    sideViewSlice: sideViewSlice,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(baseClientApi.middleware)
      .concat(rtkQueryErrorLogger);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
