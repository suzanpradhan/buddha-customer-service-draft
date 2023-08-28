'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import departmentApi from '@/modules/department/data/departmentApi';
import { DepartmentDetailType } from '@/modules/department/data/departmentTypes';
import { Edit2, Trash } from 'iconsax-react';

import { useEffect, useState } from 'react';

const DepartmentsTableListing = () => {
  const dispatch = useAppDispatch();
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
    dispatch(departmentApi.endpoints.getDepartments.initiate(pageIndex + 1));
  }, [dispatch, pageIndex]);

  const departmentsPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getDepartments`]
        ?.data as PaginatedResponseType<DepartmentDetailType>
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
                departmentApi.endpoints.deleteDepartment.initiate({
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
          departmentsPaginatedData &&
          departmentsPaginatedData.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={
                pageIndex < departmentsPaginatedData.pagination.total_page - 1
              }
              pageCount={departmentsPaginatedData.pagination.total_page}
              pageIndex={departmentsPaginatedData.pagination.current_page - 1}
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
            <th className={tableStyles.table_th}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {departmentsPaginatedData?.results?.map((department, index) => {
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{department.name}</td>
                <td className={tableStyles.table_td}>{department.slug}</td>
                <td className={tableStyles.table_td + ` flex gap-2`}>
                  <Button
                    className="h-8 w-8"
                    type="link"
                    href={`/admin/settings/departments/each/${department.slug}`}
                    prefix={<Edit2 size={18} variant="Bold" />}
                  />
                  <Button
                    className="h-8 w-8"
                    prefix={<Trash size={18} variant="Bold" />}
                    kind="danger"
                    type="button"
                    onClick={() => {
                      setOnDelete(department);
                      openModal();
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

export default DepartmentsTableListing;
