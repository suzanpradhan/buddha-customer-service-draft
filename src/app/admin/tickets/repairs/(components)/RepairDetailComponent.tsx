'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { SelectorDataType } from '@/core/types/selectorTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import Selector from '@/core/ui/components/Selector';
import { Button, PageBar, Spinner } from '@/core/ui/zenbuddha/src';
import { StatusDetailType } from '@/modules/status/data/statusTypes';
import repairsApi from '@/modules/ticket/data/repairsApis';
import { RepairDetailType } from '@/modules/ticket/data/repairsTypes';
import { CloseSquare, Edit2, Trash } from 'iconsax-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RepairDetailTab from './RepairDetailTab';
import RepairResolutionTab from './RepairResolutionTab';

export default function RepairDetailComponent({ ref_id }: { ref_id?: string }) {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  const allStatus = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllStatusForRepairs`]
        ?.data as StatusDetailType[]
  );

  const tabs = ['Details', 'Investigations', 'Attachments', 'Resolution'];

  useEffect(() => {
    if (!ref_id) {
      return;
    }

    dispatch(repairsApi.endpoints.getRepair.initiate(ref_id));
  }, [dispatch, ref_id]);

  const repairDetailData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getRepair("${ref_id!}")`]?.data as RepairDetailType
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
              dispatch(repairsApi.endpoints.deleteRepair.initiate(onDelete))
            );
            navigator.push('/admin/tickets/repairs');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {repairDetailData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-6 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    Repair #{repairDetailData.ticket.ref_id}
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {repairDetailData.ticket.title}
                  </div>
                  <div className="text-sm font-normal text-primaryGray-500">
                    {moment(repairDetailData.issued_date).format('llll')}
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
                    RESOLUTIONS
                    {tab == 1 ? (
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
                    if (repairDetailData.ticket.ref_id) {
                      setOnDelete(repairDetailData.ticket.ref_id);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<Edit2 size={20} variant="Bold" />}
                  type="link"
                  href={`admin/tickets/repairs/mutate/${repairDetailData.ticket.ref_id}`}
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
                        repairsApi.endpoints.updateRepairStatus.initiate({
                          ticket: {
                            id: repairDetailData.ticket.id,
                            status: value,
                          },
                          ref_id: repairDetailData.ticket.ref_id,
                        })
                      );
                    }}
                    value={
                      repairDetailData.ticket.status
                        ? {
                            value:
                              repairDetailData.ticket.status.id!.toString(),
                            label: repairDetailData.ticket.status.title,
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
                    navigator.push('/admin/tickets/repairs');
                  }}
                  suffix={<CloseSquare size={20} variant="Bold" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? <RepairDetailTab repair={repairDetailData} /> : <></>}
            {tab == 1 ? (
              <RepairResolutionTab repair={repairDetailData} />
            ) : (
              <></>
            )}
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
