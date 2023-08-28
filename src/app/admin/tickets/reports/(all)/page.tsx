'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import { Button, PageBar } from '@/core/ui/zenbuddha/src';
import { ReportDetailType } from '@/modules/reports/data/reportTypes';
import statusApi from '@/modules/status/data/statusApi';
import ticketApi from '@/modules/ticket/data/ticketApi';
import { AddSquare } from 'iconsax-react';
import { useEffect, useState } from 'react';
import ReportCard from '../(components)/ReportCard';

/* eslint-disable @next/next/no-img-element */
export default function TicketListingPage() {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    const reportsSubscriptionDispatch = dispatch(
      ticketApi.endpoints.getReports.initiate(pageIndex + 1, {
        subscriptionOptions: { pollingInterval: pageIndex == 0 ? 10000 : 0 },
      })
    );
    dispatch(statusApi.endpoints.getAllStatusForReports.initiate());
    return () => {
      reportsSubscriptionDispatch.unsubscribe();
    };
  }, [dispatch, pageIndex]);

  const reportsPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getReports`]
        ?.data as PaginatedResponseType<ReportDetailType>
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
              dispatch(ticketApi.endpoints.deleteReport.initiate(onDelete))
            );
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="@container/reportCard h-full">
        <PageBar
          leading={
            <div className="text-base font-bold text-dark-500">Reports</div>
          }
        >
          <div className="flex">
            <Button
              className="h-8"
              textClassName="hidden @xl/reportCard:block"
              text="Add new report"
              buttonType="bordered"
              type="link"
              href="/admin/tickets/reports/create"
              prefix={<AddSquare size={18} variant="Bold" className="mr-1" />}
            />
          </div>
        </PageBar>
        <div className="p-4 flex flex-col gap-2 items-center @xl/reportCard:items-end overflow-y-auto h-[calc(100vh-9.25rem)] custom-scrollbar">
          {reportsPaginatedData?.results?.map((report, index) => {
            return (
              <ReportCard
                key={index}
                report={report}
                onDelete={() => {
                  if (report?.ref_id) {
                    setOnDelete(report.ref_id);
                    setIsOpen(true);
                  }
                }}
              />
            );
          })}
        </div>
        <PageBar leading={<div></div>}>
          <div className="flex items-center justify-center">
            {reportsPaginatedData && reportsPaginatedData.results.length > 0 ? (
              <PaginationNav
                gotoPage={setPageIndex}
                canPreviousPage={pageIndex > 0}
                canNextPage={
                  pageIndex < reportsPaginatedData.pagination.total_page - 1
                }
                pageCount={reportsPaginatedData.pagination.total_page}
                pageIndex={reportsPaginatedData.pagination.current_page - 1}
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
