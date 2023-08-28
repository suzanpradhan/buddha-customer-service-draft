'use client';

import { PermissionType } from '@/modules/access_management/data/accessManagementType';
import { useAppSelector } from '../redux/clientStore';
import { RootState } from '../redux/store';

export function useGetPermissions(): PermissionType[] {
  return useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllUserPermissions`]?.data as PermissionType[]
  );
}
