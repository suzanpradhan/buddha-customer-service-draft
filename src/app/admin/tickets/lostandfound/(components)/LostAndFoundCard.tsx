'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { SelectorDataType } from '@/core/types/selectorTypes';
import Selector from '@/core/ui/components/Selector';
import { Button } from '@/core/ui/zenbuddha/src';
import { StatusDetailType } from '@/modules/status/data/statusTypes';
import lostandfoundApi from '@/modules/ticket/data/lostandfoundApi';
import { LostAndFoundDetailType } from '@/modules/ticket/data/lostandfoundTypes';
import { Edit2, Trash } from 'iconsax-react';
import moment from 'moment';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export interface LostAndFoundCardProps {
  report: LostAndFoundDetailType;
  onDelete: () => void;
}

/* eslint-disable @next/next/no-img-element */
const LostAndFoundCard = (props: LostAndFoundCardProps) => {
  const navigate = useRouter();
  const pathName = usePathname();
  const dispatch = useAppDispatch();

  const allStatus = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllStatusForLostAndFound`]
        ?.data as StatusDetailType[]
  );

  return (
    <div
      className={
        `w-full rounded-lg flex flex-col @xl/reportCard:flex-row cursor-pointer justify-between @xl/reportCard:justify-start ` +
        (pathName.endsWith(props.report.ref_id)
          ? 'border border-accentBlue-400 bg-gradient-to-r from-accentBlue-50 to-accentBlue-100 shadow-md shadow-accentBlue-100'
          : 'border bg-gradient-to-b from-white to-blueWhite hover:bg-gradient-to-r hover:from-accentBlue-400/10 hover:to-accentBlue-400/5')
      }
    >
      <div className="flex-1 mb-4 @xl/reportCard:mb-0 flex justify-between items-start my-3 ml-3">
        <div className="flex flex-col flex-1">
          <Link
            href={`/admin/tickets/lostandfound/each/${props.report.ref_id}`}
            className="font-semibold text-sm text-clip line-clamp-1 @xl/reportCard:text-base text-accentBlue-900"
          >
            {`#${props.report.ref_id} - ${props.report.title}`}
          </Link>
          <div className="font-normal text-xs text-primaryGray-500">
            {moment(props.report.created_on).format('llll')}
          </div>
        </div>
        <div className="flex flex-col @xl/reportCard:flex-row items-end @xl/reportCard:items-center gap-0 @xl/reportCard:gap-2 mr-2">
          <div className="gap-2 @xl/reportCard:mr-2 font-medium @xl/reportCard:w-24">
            {props.report?.severity?.name ?? '--'}
          </div>
          <div className="text-end gap-1 font-medium capitalize @xl/reportCard:w-16 line-clamp-1 @xl/reportCard:mr-2">
            {props.report?.kind ?? '--'}
          </div>
        </div>
      </div>

      <div className="flex justify-between @xl/reportCard:justify-start @xl/reportCard:flex items-end @xl/reportCard:items-center gap-2 my-3 mr-3">
        {props.report.witness ? (
          <div className="hidden @2xl/reportCard:flex mr-2 flex-1 w-32">
            <div className="flex flex-col justify-center h-fit">
              <div className="font-medium text-sm line-clamp-1">
                {!props.report.witness.profile?.full_name
                  ? props.report.witness.username
                  : `${props.report.witness?.profile?.full_name}`}
              </div>
              <div className="text-xs text-primaryGray-500 line-clamp-1">
                {props.report.witness.profile?.phone ??
                  props.report.witness.email}
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden @2xl/reportCard:flex mr-2 flex-1 w-32"></div>
        )}
        <Button
          className="h-9 bg-white hidden @xl/reportCard:block"
          buttonType="bordered"
          prefix={<Trash size={18} variant="Bold" />}
          onClick={props.onDelete}
        />
        <Button
          className="h-9 bg-white hidden @xl/reportCard:flex @xl/reportCard:items-center"
          buttonType="bordered"
          prefix={<Edit2 size={18} variant="Bold" />}
          type="link"
          href={`admin/tickets/lostandfound/create/${props.report.ref_id}`}
        />
        <div className="flex-none relative w-32 ml-3 @xl/reportCard:ml-0">
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
                  lostandfoundApi.endpoints.updateLostAndFoundStatus.initiate({
                    status: value,
                    ref_id: props.report.ref_id,
                  })
                );
              }}
              value={
                props.report.status
                  ? {
                      value: props.report.status?.id!.toString(),
                      label: props.report.status.title,
                    }
                  : undefined
              }
              name="status"
              isCompact
            ></Selector>
          )}
        </div>
      </div>
    </div>
  );
};

export default LostAndFoundCard;
