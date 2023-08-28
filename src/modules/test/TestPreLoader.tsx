'use client';

import { store } from '@/core/redux/store';
import { useRef } from 'react';
import { setData } from './testSlice';

function Preloader({ data }: { data: string }) {
  const loaded = useRef(false);
  if (!loaded.current) {
    store.dispatch(setData(data));
    loaded.current = true;
  }

  return null;
}

export default Preloader;
