'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import { useGetPermissions } from '@/core/utils/getPermission';
import statusApi from '@/modules/status/data/statusApi';
import { StatusDetailType } from '@/modules/status/data/statusTypes';
import { Edit2, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';

const StatusTableListing = () => {
  const dispatch = useAppDispatch();
  const userPermissionsData = useGetPermissions();
  const [pageIndex, setPageIndex] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    dispatch(statusApi.endpoints.getStatusList.initiate(pageIndex + 1));
  }, [dispatch, pageIndex]);

  const statusPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getStatusList`]
        ?.data as PaginatedResponseType<StatusDetailType>
  );

  return (
    <>
      <AlertDialog
        isOpen={modalIsOpen}
        deleteContent={onDelete?.title}
        onClickNo={() => {
          closeModal();
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(
                statusApi.endpoints.deleteStatus.initiate({
                  ...onDelete,
                })
              )
            );
          }
          closeModal();
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          statusPaginatedData && statusPaginatedData.results.length > 0 ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={
                pageIndex < statusPaginatedData.pagination.total_page - 1
              }
              pageCount={statusPaginatedData.pagination.total_page}
              pageIndex={statusPaginatedData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>TITLE</th>
            <th className={tableStyles.table_th}>KIND</th>
            <th className={tableStyles.table_th}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {statusPaginatedData?.results?.map((status, index) => {
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{status.title}</td>
                <td className={tableStyles.table_td}>{status.kind}</td>
                <td className={tableStyles.table_td + ` flex gap-2`}>
                  {userPermissionsData?.find(
                    (permission) => permission.codename == 'change_status'
                  ) ? (
                    <Button
                      className="h-8 w-8"
                      type="link"
                      href={`admin/settings/status/each/${status.slug}`}
                      prefix={<Edit2 size={18} variant="Bold" />}
                    />
                  ) : (
                    <></>
                  )}
                  {userPermissionsData?.find(
                    (permission) => permission.codename == 'delete_status'
                  ) ? (
                    <Button
                      className="h-8 w-8"
                      prefix={<Trash size={18} variant="Bold" />}
                      kind="danger"
                      type="button"
                      onClick={() => {
                        setOnDelete(status);
                        openModal();
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableCard>
    </>
  );
};

export default StatusTableListing;
