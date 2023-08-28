'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import rolesApi from '@/modules/access_management/data/accessManagementApi';
import { RoleType } from '@/modules/access_management/data/accessManagementType';
import { Edit2, Trash } from 'iconsax-react';
import { useEffect } from 'react';

const RolesTableListing = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(rolesApi.endpoints.getAllRoles.initiate());
  }, [dispatch]);

  const rolesData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllRoles`]?.data as RoleType[]
  );

  return (
    <TableCard>
      <thead>
        <tr className={tableStyles.table_thead_tr}>
          <th className={tableStyles.table_th}>NAME</th>
          <th className={tableStyles.table_th}>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {rolesData?.map((role, index) => {
          return (
            <tr key={index} className={tableStyles.table_tbody_tr}>
              <td className={tableStyles.table_td}>{role.name}</td>
              <td className={tableStyles.table_td + ` flex gap-2`}>
                <Button
                  className="h-8 w-8"
                  type="link"
                  href={`admin/access/roles/each/${role.id}`}
                  prefix={<Edit2 size={18} variant="Bold" />}
                />
                <Button
                  className="h-8 w-8"
                  prefix={<Trash size={18} variant="Bold" />}
                  kind="danger"
                  type="button"
                  onClick={() => {
                    dispatch(
                      rolesApi.endpoints.deleteRole.initiate({ ...role })
                    );
                  }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </TableCard>
  );
};

export default RolesTableListing;
