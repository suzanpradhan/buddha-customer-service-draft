'use client';

import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import AlertDialog from '@/core/ui/components/AlertDialog';
import { Button, PageBar, Spinner } from '@/core/ui/zenbuddha/src';
import spotCheckApi from '@/modules/spotcheck/spotcheckApi';
import { SpotCheckDetailType } from '@/modules/spotcheck/spotcheckTypes';
import { CloseSquare, Edit2, Trash } from 'iconsax-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DetailTab from '../(components)/DetailTab';
import EvaluationTab from '../(components)/EvaluationTab';
import SpotCheckRatingsTab from '../(components)/SpotCheckRatingsTab';

export default function EachSpotCheckPage({
  params,
}: {
  params: { ref_id?: string };
}) {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    if (!params.ref_id) {
      return;
    }
    dispatch(spotCheckApi.endpoints.getSpotCheck.initiate(params.ref_id));
  }, [dispatch, params.ref_id]);

  // const surveyData = useAppSelector(
  //   (state: RootState) =>
  //     state.baseApi.queries[`getSurvey("${params?.ref_id!}")`]
  //       ?.data as SurveyDetailType
  // );
  const spotCheckData = useGetApiResponse<SpotCheckDetailType>(
    `getSpotCheck("${params?.ref_id!}")`
  );

  // const participantsData = useGetApiResponse<
  //   PaginatedResponseType<SurveyParticipantsType>
  // >(`getSurveyParticipants`);

  const handleTabNavigation = (index: number) => {
    setTab(index);
  }; // if (surveyData && !participantsData && index == 1) {
  //   dispatch(
  //     surveyApi.endpoints.getSurveyParticipants.initiate({
  //       surveyRefId: params.ref_id!,
  //     })
  //   );
  // }

  return (
    <>
      <AlertDialog
        isOpen={modalIsOpen}
        deleteContent={onDelete?.title}
        onClickNo={() => {
          setIsOpen(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(
                spotCheckApi.endpoints.deleteSpotCheck.initiate(onDelete.ref_id)
              )
            );
            navigator.push('/admin/spotchecks');
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {spotCheckData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-6 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    SPOT CHECK #{spotCheckData.ref_id}
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    {spotCheckData.title}
                  </div>
                  <div className="text-sm font-normal text-primaryGray-500">
                    {moment(spotCheckData.date).format('ll')}
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
                      handleTabNavigation(0);
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
                      handleTabNavigation(1);
                    }}
                  >
                    STAFF RATINGS
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
                      handleTabNavigation(2);
                    }}
                  >
                    EVALUATIONS
                    {tab == 2 ? (
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
                    setOnDelete(spotCheckData);
                    setIsOpen(true);
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="link"
                  href={`admin/spotchecks/mutate/${spotCheckData.ref_id}`}
                  prefix={<Edit2 size={20} variant="Bold" />}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="button"
                  onClick={() => {
                    navigator.push('surveys');
                  }}
                  suffix={<CloseSquare size={20} variant="Bold" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? <DetailTab spotcheck={spotCheckData} /> : <></>}
            {tab == 1 ? (
              <SpotCheckRatingsTab spotCheck={spotCheckData} />
            ) : (
              <></>
            )}
            {tab == 2 ? <EvaluationTab spotCheck={spotCheckData} /> : <></>}
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
