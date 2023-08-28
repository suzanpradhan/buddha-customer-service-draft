'use client';

import { store } from '@/core/redux/store';
import { useRef } from 'react';
import { AccountDetailType } from '../data/accountTypes';
import { setAccountListData } from './accountListSlice';

function AccountListPreLoader({ data }: { data: AccountDetailType[] }) {
  const loaded = useRef(false);
  if (!loaded.current) {
    store.dispatch(setAccountListData(data));
    loaded.current = true;
  }

  return null;
}

export default AccountListPreLoader;
