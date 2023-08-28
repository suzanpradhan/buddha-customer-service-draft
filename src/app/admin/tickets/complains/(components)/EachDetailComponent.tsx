'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { SelectorDataType } from '@/core/types/selectorTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import Selector from '@/core/ui/components/Selector';
import { Button, PageBar, Spinner } from '@/core/ui/zenbuddha/src';
import { StatusDetailType } from '@/modules/status/data/statusTypes';
import { ComplainDetailType } from '@/modules/ticket/data/complainTypes';
import complainsApi from '@/modules/ticket/data/complainsApi';
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
      state.baseApi.queries[`getAllStatusForComplains`]
        ?.data as StatusDetailType[]
  );

  const tabs = ['Details', 'Investigations', 'Attachments', 'Resolution'];

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(complainsApi.endpoints.getComplain.initiate(id));
  }, [dispatch, id]);

  const complainsData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getComplain("${id!}")`]?.data as ComplainDetailType
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
            navigator.push('/admin/tickets/complains');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {complainsData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-6 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    Complain #{complainsData.ref_id}
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {complainsData.title}
                  </div>
                  <div className="text-sm font-normal text-primaryGray-500">
                    {moment(complainsData.created_on).format('llll')}
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
                    if (complainsData?.ref_id) {
                      setOnDelete(complainsData.ref_id);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<Edit2 size={20} variant="Bold" />}
                  type="link"
                  href={`admin/tickets/complains/create/${complainsData.ref_id}`}
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
                        complainsApi.endpoints.updateComplainStatus.initiate({
                          status: value,
                          ref_id: complainsData.ref_id,
                        })
                      );
                    }}
                    value={
                      complainsData.status
                        ? {
                            value: complainsData.status.id!.toString(),
                            label: complainsData.status.title,
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
                    navigator.push('/admin/tickets/complains');
                  }}
                  suffix={<CloseSquare size={20} variant="Bold" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? <DetailTab report={complainsData} /> : <></>}
            {tab == 1 ? <AttachmentsTab report={complainsData} /> : <></>}
            {tab == 2 ? <InvestigationTab report={complainsData} /> : <></>}
            {tab == 3 ? <ResolutionTab report={complainsData} /> : <></>}
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
