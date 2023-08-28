'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { SelectorDataType } from '@/core/types/selectorTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import Selector from '@/core/ui/components/Selector';
import { Button, PageBar, Spinner } from '@/core/ui/zenbuddha/src';
import { ReportDetailType } from '@/modules/reports/data/reportTypes';
import { StatusDetailType } from '@/modules/status/data/statusTypes';
import ticketApi from '@/modules/ticket/data/ticketApi';
import { CloseSquare, Edit2, Trash } from 'iconsax-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AttachmentsTab from './AttachmentsTab';
import DetailTab from './DetailTab';
import InvestigationTab from './InvestigationTab';
import ResolutionTab from './ResolutionTab';

export default function EachDetailComponent({ id }: { id?: string }) {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  const allStatus = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllStatusForReports`]
        ?.data as StatusDetailType[]
  );

  const tabs = ['Details', 'Investigations', 'Attachments', 'Resolution'];

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(ticketApi.endpoints.getReport.initiate(id));
  }, [dispatch, id]);

  const reportData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getReport("${id!}")`]?.data as ReportDetailType
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
            navigator.push('/admin/tickets/reports');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {reportData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-6 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    Report #{reportData.ref_id}
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {reportData.title}
                  </div>
                  <div className="text-sm font-normal text-primaryGray-500">
                    {moment(reportData.created_on).format('llll')}
                  </div>
                </div>
              }
              bottom={
                <div className="flex gap-4 text-base font-normal text-primaryGray-500 pb-2">
                  <button
                    className={
                      tab == 0
                        ? 'text-dark-500 font-semibold relative text-sm'
                        : 'text-dark-500 font-normal text-sm'
                    }
                    onClick={() => {
                      setTab(0);
                    }}
                  >
                    DETAILS
                    {tab == 0 ? (
                      <div className="absolute top-[calc(100%+6px)] h-[2px] w-full bg-dark-500 rounded-md"></div>
                    ) : (
                      <></>
                    )}
                  </button>
                  <button
                    className={
                      tab == 1
                        ? 'text-dark-500 font-semibold relative text-sm'
                        : 'text-dark-500 font-normal text-sm'
                    }
                    onClick={() => {
                      setTab(1);
                    }}
                  >
                    ATTACHMENTS
                    {tab == 1 ? (
                      <div className="absolute top-[calc(100%+6px)] h-[2px] w-full bg-dark-500 rounded-md"></div>
                    ) : (
                      <></>
                    )}
                  </button>
                  <button
                    className={
                      tab == 2
                        ? 'text-dark-500 font-semibold relative text-sm'
                        : 'text-dark-500 font-normal text-sm'
                    }
                    onClick={() => {
                      setTab(2);
                    }}
                  >
                    INVESTIGATION
                    {tab == 2 ? (
                      <div className="absolute top-[calc(100%+6px)] h-[2px] w-full bg-dark-500 rounded-md"></div>
                    ) : (
                      <></>
                    )}
                  </button>
                  <button
                    className={
                      tab == 3
                        ? 'text-dark-500 font-semibold relative text-sm'
                        : 'text-dark-500 font-normal text-sm'
                    }
                    onClick={() => {
                      setTab(3);
                    }}
                  >
                    RESOLUTIONS
                    {tab == 3 ? (
                      <div className="absolute top-[calc(100%+6px)] h-[2px] w-full bg-dark-500 rounded-md"></div>
                    ) : (
                      <></>
                    )}
                  </button>
                </div>
              }
            >
              <div className="flex gap-2">
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<Trash size={20} variant="Bold" />}
                  onClick={() => {
                    if (reportData?.ref_id) {
                      setOnDelete(reportData.ref_id);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<Edit2 size={20} variant="Bold" />}
                  type="link"
                  href={`admin/tickets/reports/create/${reportData.ref_id}`}
                />
                {allStatus && (
                  <Selector
                    id="status_selector"
                    isClearable={false}
                    options={allStatus?.map(
                      (status) =>
                        ({
                          value: status.id!.toString(),
                          label: status.title,
                        } as SelectorDataType)
                    )}
                    placeholder="No Status"
                    className="flex-1 mb-2"
                    onChange={(name: string, value: string) => {
                      dispatch(
                        ticketApi.endpoints.updateReportStatus.initiate({
                          status: value,
                          ref_id: reportData.ref_id,
                        })
                      );
                    }}
                    value={
                      reportData.status
                        ? {
                            value: reportData.status.id!.toString(),
                            label: reportData.status.title,
                          }
                        : undefined
                    }
                    name="status"
                    isCompact
                  ></Selector>
                )}
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="button"
                  onClick={() => {
                    navigator.push('/admin/tickets/reports');
                  }}
                  suffix={<CloseSquare size={20} variant="Bold" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? <DetailTab report={reportData} /> : <></>}
            {tab == 1 ? <AttachmentsTab report={reportData} /> : <></>}
            {tab == 2 ? <InvestigationTab report={reportData} /> : <></>}
            {tab == 3 ? <ResolutionTab report={reportData} /> : <></>}
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[calc(100vh-3.25rem)]">
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
}
