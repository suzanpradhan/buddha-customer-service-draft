'use client';

import { useAppSelector } from '../redux/clientStore';
import { RootState } from '../redux/store';

export function useGetApiResponse<T>(key: string): T {
  return useAppSelector(
    (state: RootState) => state.baseApi.queries[key]?.data as T
  );
}
