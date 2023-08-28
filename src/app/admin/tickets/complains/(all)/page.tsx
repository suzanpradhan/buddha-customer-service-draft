'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, PageBar } from '@/core/ui/zenbuddha/src';
import statusApi from '@/modules/status/data/statusApi';
import { ComplainDetailType } from '@/modules/ticket/data/complainTypes';
import complainsApi from '@/modules/ticket/data/complainsApi';
import { AddSquare } from 'iconsax-react';
import { useEffect, useState } from 'react';
import ComplainCard from '../(components)/ComplainCard';

/* eslint-disable @next/next/no-img-element */
export default function TicketListingPage() {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    dispatch(complainsApi.endpoints.getComplains.initiate(pageIndex + 1));
    dispatch(statusApi.endpoints.getAllStatusForComplains.initiate());
  }, [dispatch, pageIndex]);

  const complainsPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getComplains`]
        ?.data as PaginatedResponseType<ComplainDetailType>
  );

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
              dispatch(complainsApi.endpoints.deleteComplain.initiate(onDelete))
            );
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="@container/reportCard h-full">
        <PageBar
          leading={
            <div className="text-base font-bold text-dark-500">Complains</div>
          }
        >
          <div className="flex">
            <Button
              className="h-8"
              textClassName="hidden @xl/reportCard:block"
              text="Add new complain"
              buttonType="bordered"
              type="link"
              href="/admin/tickets/complains/create"
              prefix={<AddSquare size={18} variant="Bold" className="mr-1" />}
            />
          </div>
        </PageBar>
        <div className="p-4 flex flex-col gap-2 items-center @xl/reportCard:items-end overflow-y-auto h-[calc(100vh-9.25rem)] custom-scrollbar">
          {complainsPaginatedData?.results?.map((complain, index) => {
            return (
              <ComplainCard
                key={index}
                report={complain}
                onDelete={() => {
                  if (complain?.ref_id) {
                    setOnDelete(complain.ref_id);
                    setIsOpen(true);
                  }
                }}
              />
            );
          })}
        </div>
        <PageBar leading={<div></div>}>
          <div className="flex items-center justify-center">
            {complainsPaginatedData &&
            complainsPaginatedData.results.length > 0 ? (
              <PaginationNav
                gotoPage={setPageIndex}
                canPreviousPage={pageIndex > 0}
                canNextPage={
                  pageIndex < complainsPaginatedData.pagination.total_page - 1
                }
                pageCount={complainsPaginatedData.pagination.total_page}
                pageIndex={complainsPaginatedData.pagination.current_page - 1}
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
