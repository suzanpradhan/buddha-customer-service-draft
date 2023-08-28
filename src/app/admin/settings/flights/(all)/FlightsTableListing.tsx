'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import { useGetPermissions } from '@/core/utils/getPermission';
import flightApi from '@/modules/flights/data/flightApi';
import { FlightDetailType } from '@/modules/flights/data/flightTypes';
import { Edit2, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';

const FlightsTableListing = () => {
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
    dispatch(flightApi.endpoints.getFlights.initiate(pageIndex + 1));
  }, [dispatch, pageIndex]);

  const flightsPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getFlights`]
        ?.data as PaginatedResponseType<FlightDetailType>
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
                flightApi.endpoints.deleteFlight.initiate({ ...onDelete })
              )
            );
          }
          closeModal();
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          flightsPaginatedData && flightsPaginatedData.results.length > 0 ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={
                pageIndex < flightsPaginatedData.pagination.total_page - 1
              }
              pageCount={flightsPaginatedData.pagination.total_page}
              pageIndex={flightsPaginatedData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>TITLE</th>
            <th className={tableStyles.table_th}>FLIGHT NO.</th>
            <th className={tableStyles.table_th + ` w-24`}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {flightsPaginatedData?.results?.map((flight, index) => {
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{flight.title}</td>
                <td className={tableStyles.table_td}>{flight.number}</td>
                <td className={tableStyles.table_td + ` flex gap-2 w-24`}>
                  {userPermissionsData?.find(
                    (permission) => permission.codename == 'change_flight'
                  ) ? (
                    <Button
                      className="h-8 w-8"
                      type="link"
                      href={`admin/settings/flights/each/${flight.slug}`}
                      prefix={<Edit2 size={18} variant="Bold" />}
                    />
                  ) : (
                    <></>
                  )}
                  {userPermissionsData?.find(
                    (permission) => permission.codename == 'delete_flight'
                  ) ? (
                    <Button
                      className="h-8 w-8"
                      prefix={<Trash size={18} variant="Bold" />}
                      kind="danger"
                      type="button"
                      onClick={() => {
                        setOnDelete(flight);
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

export default FlightsTableListing;
