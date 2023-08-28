'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import { useGetPermissions } from '@/core/utils/getPermission';
import severityApi from '@/modules/severities/data/severityApi';
import { SeverityDetailType } from '@/modules/severities/data/severityTypes';
import { Edit2, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';

const SeveritiesTableListing = () => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);
  const userPermissionsData = useGetPermissions();

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    dispatch(severityApi.endpoints.getSeverities.initiate(pageIndex + 1));
  }, [dispatch, pageIndex]);

  const severitiesPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getSeverities`]
        ?.data as PaginatedResponseType<SeverityDetailType>
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
                severityApi.endpoints.deleteSeverity.initiate({
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
          severitiesPaginatedData &&
          severitiesPaginatedData.results.length > 0 ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={
                pageIndex < severitiesPaginatedData.pagination.total_page - 1
              }
              pageCount={severitiesPaginatedData.pagination.total_page}
              pageIndex={severitiesPaginatedData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>TITLE</th>
            <th className={tableStyles.table_th}>LEVEL</th>
            <th className={tableStyles.table_th}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {severitiesPaginatedData?.results?.map((severity, index) => {
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{severity.name}</td>
                <td className={tableStyles.table_td}>{severity.level}</td>
                <td className={tableStyles.table_td + ` flex gap-2`}>
                  {userPermissionsData?.find(
                    (permission) => permission.codename == 'change_severity'
                  ) ? (
                    <Button
                      className="h-8 w-8"
                      type="link"
                      href={`admin/settings/severities/each/${severity.slug}`}
                      prefix={<Edit2 size={18} variant="Bold" />}
                    />
                  ) : (
                    <></>
                  )}
                  {userPermissionsData?.find(
                    (permission) => permission.codename == 'delete_severity'
                  ) ? (
                    <Button
                      className="h-8 w-8"
                      prefix={<Trash size={18} variant="Bold" />}
                      kind="danger"
                      type="button"
                      onClick={() => {
                        setOnDelete(severity);
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

export default SeveritiesTableListing;
