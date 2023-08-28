'use client';

import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, PageBar } from '@/core/ui/zenbuddha/src';
import statusApi from '@/modules/status/data/statusApi';
import repairsApi from '@/modules/ticket/data/repairsApis';
import { RepairDetailType } from '@/modules/ticket/data/repairsTypes';
import { AddSquare } from 'iconsax-react';
import { useEffect, useState } from 'react';
import RepairCard from '../(components)/RepairCard';

/* eslint-disable @next/next/no-img-element */
export default function RepairsListingPage() {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    dispatch(repairsApi.endpoints.getRepairs.initiate(pageIndex + 1));
    dispatch(statusApi.endpoints.getAllStatusForRepairs.initiate());
  }, [dispatch, pageIndex]);

  const repairsPaginatedData =
    useGetApiResponse<PaginatedResponseType<RepairDetailType>>('getRepairs');

  return (
    <>
      <AlertDialog
        isOpen={modalIsOpen}
        deleteContent={`Ticket: ${onDelete}`}
        onClickNo={() => {
          setIsOpen(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(repairsApi.endpoints.deleteRepair.initiate(onDelete))
            );
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="@container/reportCard h-full">
        <PageBar
          leading={
            <div className="text-base font-bold text-dark-500">
              Baggage Repairs
            </div>
          }
        >
          <div className="flex">
            <Button
              className="h-8"
              textClassName="hidden @xl/reportCard:block"
              text="Add new Baggage Repair"
              buttonType="bordered"
              type="link"
              href="/admin/tickets/repairs/mutate"
              prefix={<AddSquare size={18} variant="Bold" className="mr-1" />}
            />
          </div>
        </PageBar>
        <div className="p-4 flex flex-col gap-2 items-center @xl/reportCard:items-end overflow-y-auto h-[calc(100vh-9.25rem)] custom-scrollbar">
          {repairsPaginatedData?.results?.map((repair, index) => {
            return (
              <RepairCard
                key={index}
                repair={repair}
                onDelete={() => {
                  if (repair?.ticket.ref_id) {
                    setOnDelete(repair.ticket.ref_id);
                    setIsOpen(true);
                  }
                }}
              />
            );
          })}
        </div>
        <PageBar leading={<div></div>}>
          <div className="flex items-center justify-center">
            {repairsPaginatedData && repairsPaginatedData.results.length > 0 ? (
              <PaginationNav
                gotoPage={setPageIndex}
                canPreviousPage={pageIndex > 0}
                canNextPage={
                  pageIndex < repairsPaginatedData.pagination.total_page - 1
                }
                pageCount={repairsPaginatedData.pagination.total_page}
                pageIndex={repairsPaginatedData.pagination.current_page - 1}
              />
            ) : (
              <></>
            )}
          </div>
        </PageBar>
      </div>
    </>
  );
}
