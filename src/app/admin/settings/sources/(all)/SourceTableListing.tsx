'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import { useGetPermissions } from '@/core/utils/getPermission';
import sourceApi from '@/modules/source/source/sourceApi';
import { SourceDetailType } from '@/modules/source/source/sourceTypes';
import { Edit2, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';

const SourceTableListing = () => {
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
    dispatch(sourceApi.endpoints.getSources.initiate(pageIndex + 1));
  }, [dispatch, pageIndex]);

  const sourcesPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getSources`]
        ?.data as PaginatedResponseType<SourceDetailType>
  );

  return (
    <>
      <AlertDialog
        isOpen={modalIsOpen}
        deleteContent={onDelete?.name}
        onClickNo={() => {
          closeModal();
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(
                sourceApi.endpoints.deleteSource.initiate({
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
          sourcesPaginatedData && sourcesPaginatedData.results.length > 0 ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={
                pageIndex < sourcesPaginatedData.pagination.total_page - 1
              }
              pageCount={sourcesPaginatedData.pagination.total_page}
              pageIndex={sourcesPaginatedData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>TITLE</th>
            <th className={tableStyles.table_th}>SLUG</th>
            <th className={tableStyles.table_th + ` w-24`}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {sourcesPaginatedData?.results?.map((source, index) => {
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{source.name}</td>
                <td className={tableStyles.table_td}>{source.slug}</td>
                <td className={tableStyles.table_td + ` flex gap-2 w-24`}>
                  {userPermissionsData?.find(
                    (permission) => permission.codename == 'change_source'
                  ) ? (
                    <Button
                      className="h-8 w-8"
                      type="link"
                      href={`admin/settings/sources/each/${source.slug}`}
                      prefix={<Edit2 size={18} variant="Bold" />}
                    />
                  ) : (
                    <></>
                  )}
                  {userPermissionsData?.find(
                    (permission) => permission.codename == 'delete_source'
                  ) ? (
                    <Button
                      className="h-8 w-8"
                      prefix={<Trash size={18} variant="Bold" />}
                      kind="danger"
                      type="button"
                      onClick={() => {
                        setOnDelete(source);
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

export default SourceTableListing;
