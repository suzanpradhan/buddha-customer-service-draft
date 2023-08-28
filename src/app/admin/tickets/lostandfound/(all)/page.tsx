'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, PageBar } from '@/core/ui/zenbuddha/src';
import statusApi from '@/modules/status/data/statusApi';
import lostandfoundApi from '@/modules/ticket/data/lostandfoundApi';
import { LostAndFoundDetailType } from '@/modules/ticket/data/lostandfoundTypes';
import { AddSquare } from 'iconsax-react';
import { useEffect, useState } from 'react';
import LostAndFoundCard from '../(components)/LostAndFoundCard';

/* eslint-disable @next/next/no-img-element */
export default function TicketListingPage() {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    dispatch(
      lostandfoundApi.endpoints.getLostAndFoundList.initiate(pageIndex + 1)
    );
    dispatch(statusApi.endpoints.getAllStatusForLostAndFound.initiate());
  }, [dispatch, pageIndex]);

  const lostAndFoundPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getLostAndFoundList`]
        ?.data as PaginatedResponseType<LostAndFoundDetailType>
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
              dispatch(
                lostandfoundApi.endpoints.deleteLostAndFound.initiate(onDelete)
              )
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
              Lost and founds
            </div>
          }
        >
          <div className="flex">
            <Button
              className="h-8"
              textClassName="hidden @xl/reportCard:block"
              text="Add new Lost&Found"
              buttonType="bordered"
              type="link"
              href="/admin/tickets/lostandfound/create"
              prefix={<AddSquare size={18} variant="Bold" className="mr-1" />}
            />
          </div>
        </PageBar>
        <div className="p-4 flex flex-col gap-2 items-center @xl/reportCard:items-end overflow-y-auto h-[calc(100vh-9.25rem)] custom-scrollbar">
          {lostAndFoundPaginatedData?.results?.map((lostAndFound, index) => {
            return (
              <LostAndFoundCard
                key={index}
                report={lostAndFound}
                onDelete={() => {
                  if (lostAndFound?.ref_id) {
                    setOnDelete(lostAndFound.ref_id);
                    setIsOpen(true);
                  }
                }}
              />
            );
          })}
        </div>
        <PageBar leading={<div></div>}>
          <div className="flex items-center justify-center">
            {lostAndFoundPaginatedData &&
            lostAndFoundPaginatedData.results.length > 0 ? (
              <PaginationNav
                gotoPage={setPageIndex}
                canPreviousPage={pageIndex > 0}
                canNextPage={
                  pageIndex <
                  lostAndFoundPaginatedData.pagination.total_page - 1
                }
                pageCount={lostAndFoundPaginatedData.pagination.total_page}
                pageIndex={
                  lostAndFoundPaginatedData.pagination.current_page - 1
                }
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
