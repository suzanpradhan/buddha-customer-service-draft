'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import spotCheckApi from '@/modules/spotcheck/spotcheckApi';
import { SpotCheckDetailType } from '@/modules/spotcheck/spotcheckTypes';
import { Edit2, Eye, Trash } from 'iconsax-react';
import moment from 'moment';
import { useEffect, useState } from 'react';

const SpotChecksTableListing = () => {
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
    dispatch(
      spotCheckApi.endpoints.getPaginatedSpotChecksList.initiate(pageIndex + 1)
    );
  }, [dispatch, pageIndex]);

  const spotChecksListPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getPaginatedSpotChecksList`]
        ?.data as PaginatedResponseType<SpotCheckDetailType>
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
                spotCheckApi.endpoints.deleteSpotCheck.initiate(onDelete.ref_id)
              )
            );
          }
          closeModal();
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          spotChecksListPaginatedData &&
          spotChecksListPaginatedData.results.length > 0 ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={
                pageIndex <
                spotChecksListPaginatedData.pagination.total_page - 1
              }
              pageCount={spotChecksListPaginatedData.pagination.total_page}
              pageIndex={
                spotChecksListPaginatedData.pagination.current_page - 1
              }
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th + ` w-28`}>REF. ID</th>
            <th className={tableStyles.table_th}>TITLE</th>
            <th className={tableStyles.table_th}>DATE</th>
            <th className={tableStyles.table_th + ` w-36`}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {spotChecksListPaginatedData?.results?.map((spotCheck, index) => {
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td + ` w-28`}>
                  {spotCheck.ref_id}
                </td>
                <td className={tableStyles.table_td}>{spotCheck.title}</td>
                <td className={tableStyles.table_td}>
                  {moment(spotCheck.date).format('ll')}
                </td>
                <td className={tableStyles.table_td + ` flex gap-2 w-36`}>
                  <Button
                    className="h-8 w-8"
                    type="link"
                    kind="secondary"
                    href={`admin/spotchecks/each/${spotCheck.ref_id}`}
                    prefix={<Eye size={18} variant="Bold" />}
                  />
                  <Button
                    className="h-8 w-8"
                    type="link"
                    href={`admin/spotchecks/mutate/${spotCheck.ref_id}`}
                    prefix={<Edit2 size={18} variant="Bold" />}
                  />
                  <Button
                    className="h-8 w-8"
                    prefix={<Trash size={18} variant="Bold" />}
                    kind="danger"
                    type="button"
                    onClick={() => {
                      setOnDelete(spotCheck);
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

export default SpotChecksTableListing;
