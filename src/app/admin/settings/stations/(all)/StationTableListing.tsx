'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, TableCard, tableStyles } from '@/core/ui/zenbuddha/src';
import { useGetPermissions } from '@/core/utils/getPermission';
import stationApi from '@/modules/station/data/stationApi';
import { StationDetailType } from '@/modules/station/data/stationTypes';
import { Edit2, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';

const StationTableListing = () => {
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
    dispatch(stationApi.endpoints.getStations.initiate(pageIndex + 1));
  }, [dispatch, pageIndex]);

  const stationsPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getStations`]
        ?.data as PaginatedResponseType<StationDetailType>
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
                stationApi.endpoints.deleteStation.initiate({
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
          stationsPaginatedData && stationsPaginatedData.results.length > 0 ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={
                pageIndex < stationsPaginatedData.pagination.total_page - 1
              }
              pageCount={stationsPaginatedData.pagination.total_page}
              pageIndex={stationsPaginatedData.pagination.current_page - 1}
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
          {stationsPaginatedData?.results?.map((station, index) => {
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{station.name}</td>
                <td className={tableStyles.table_td}>{station.slug}</td>
                <td className={tableStyles.table_td + ` flex gap-2`}>
                  {userPermissionsData?.find(
                    (permission) => permission.codename == 'change_station'
                  ) ? (
                    <Button
                      className="h-8 w-8"
                      type="link"
                      href={`admin/settings/stations/each/${station.slug}`}
                      prefix={<Edit2 size={18} variant="Bold" />}
                    />
                  ) : (
                    <></>
                  )}
                  {userPermissionsData?.find(
                    (permission) => permission.codename == 'delete_station'
                  ) ? (
                    <Button
                      className="h-8 w-8"
                      prefix={<Trash size={18} variant="Bold" />}
                      kind="danger"
                      type="button"
                      onClick={() => {
                        setOnDelete(station);
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

export default StationTableListing;
