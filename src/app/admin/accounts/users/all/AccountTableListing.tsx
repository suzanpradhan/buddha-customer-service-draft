'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import accountApi from '@/modules/accounts/data/accountApi';
import { AccountDetailType } from '@/modules/accounts/data/accountTypes';
import { Edit2, Setting2, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';

const AccountTableListing = () => {
  const dispatch = useAppDispatch();
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    dispatch(accountApi.endpoints.getAccounts.initiate(pageIndex + 1));
  }, [dispatch, pageIndex]);

  const accountsPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAccounts`]
        ?.data as PaginatedResponseType<AccountDetailType>
  );
  return (
    <>
      <AlertDialog
        isOpen={deleteModelOpen}
        deleteContent={onDelete}
        onClickNo={() => {
          toggleDeleteModel(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(
                accountApi.endpoints.deleteUser.initiate(onDelete as string)
              )
            );
          }
          toggleDeleteModel(false);
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          accountsPaginatedData && accountsPaginatedData.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={
                pageIndex < accountsPaginatedData.pagination.total_page - 1
              }
              pageCount={accountsPaginatedData.pagination.total_page}
              pageIndex={accountsPaginatedData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>Full name</th>
            <th className={tableStyles.table_th}>Username</th>
            <th className={tableStyles.table_th}>EMAIL</th>
            <th className={tableStyles.table_th}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {accountsPaginatedData?.results?.map((account, index) => {
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>
                  {account.profile?.full_name}
                </td>
                <td className={tableStyles.table_td}>{account.username}</td>
                <td className={tableStyles.table_td}>{account.email}</td>
                <td className={tableStyles.table_td + ` flex gap-2 max-w-xs`}>
                  <Button
                    className="h-8 w-8"
                    type="link"
                    href={`admin/accounts/users/mutate/${account.username}/`}
                    prefix={<Edit2 size={18} variant="Bold" />}
                  />
                  <Button
                    className="h-8 w-8"
                    type="link"
                    kind="secondary"
                    href={`admin/accounts/users/${account.username}/manage`}
                    prefix={<Setting2 size={18} variant="Bold" />}
                  />
                  <Button
                    className="h-8 w-8"
                    kind="danger"
                    type="button"
                    prefix={<Trash size={18} variant="Bold" />}
                    onClick={() => {
                      setOnDelete(account.username);
                      toggleDeleteModel(true);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableCard>
    </>
  );
};

export default AccountTableListing;
