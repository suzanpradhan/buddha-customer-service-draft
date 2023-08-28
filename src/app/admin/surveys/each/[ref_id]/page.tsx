'use client';

import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { Button, PageBar, Spinner } from '@/core/ui/zenbuddha/src';
import surveyApi from '@/modules/survey/surveyApi';
import {
  SurveyDetailType,
  SurveyParticipantsType,
} from '@/modules/survey/surveyTypes';
import { CloseSquare, Edit2, Trash } from 'iconsax-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DetailTab from '../(components)/DetailTab';
import ParticipantsTab from '../(components)/ParticipantsTab';
import QuestionnairesTab from '../(components)/QuestionnairesTab';

export default function EachSurveyPage({
  params,
}: {
  params: { ref_id?: string };
}) {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!params.ref_id) {
      return;
    }
    dispatch(surveyApi.endpoints.getSurvey.initiate(params.ref_id));
  }, [dispatch, params.ref_id]);

  // const surveyData = useAppSelector(
  //   (state: RootState) =>
  //     state.baseApi.queries[`getSurvey("${params?.ref_id!}")`]
  //       ?.data as SurveyDetailType
  // );
  const surveyData = useGetApiResponse<SurveyDetailType>(
    `getSurvey("${params?.ref_id!}")`
  );

  const handleTabNavigation = (index: number) => {
    if (surveyData && !participantsData && index == 1) {
      dispatch(
        surveyApi.endpoints.getSurveyParticipants.initiate({
          surveyRefId: params.ref_id!,
        })
      );
    }
    setTab(index);
  };

  const participantsData = useGetApiResponse<
    PaginatedResponseType<SurveyParticipantsType>
  >(`getSurveyParticipants:${params.ref_id}`);

  return (
    <div className="flex flex-col">
      {surveyData ? (
        <>
          <PageBar
            leading={
              <div className="flex flex-col pt-6 pb-4">
                <div className="text-sm font-medium text-primaryGray-500">
                  SURVEY #{surveyData.ref_id}
                </div>
                <div className="text-base font-bold text-dark-500">
                  {surveyData.title}
                </div>
                <div className="text-sm font-normal text-primaryGray-500">
                  {moment(surveyData.start_date).format('ll')}
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
                  PARTICIPANTS
                  {tab == 1 ? (
                    <div className="absolute top-[calc(100%+6px)] h-[2px] w-full bg-dark-500 rounded-md"></div>
                  ) : (
                    <></>
                  )}
                </button>
                {surveyData.kind == 'questions' ? (
                  <button
                    className={
                      tab == 3
                        ? 'text-dark-500 font-semibold relative text-sm'
                        : 'text-dark-500 font-normal text-sm'
                    }
                    onClick={() => {
                      handleTabNavigation(3);
                    }}
                  >
                    QUESTIONNAIRES
                    {tab == 3 ? (
                      <div className="absolute top-[calc(100%+6px)] h-[2px] w-full bg-dark-500 rounded-md"></div>
                    ) : (
                      <></>
                    )}
                  </button>
                ) : (
                  <></>
                )}
              </div>
            }
          >
            <div className="flex gap-2">
              <Button
                className="w-9 h-9"
                buttonType="bordered"
                prefix={<Trash size={20} variant="Bold" />}
                onClick={() => {
                  // if (surveyData.ref_id) {
                  //   dispatch(
                  //     ticketApi.endpoints.deleteReport.initiate(
                  //       surveyData.ref_id
                  //     )
                  //   );
                  //   navigator.push('/tickets/complains');
                  // }
                }}
              />
              <Button
                className="w-9 h-9"
                buttonType="bordered"
                type="link"
                href={`admin/surveys/mutate/${surveyData.ref_id}`}
                prefix={<Edit2 size={20} variant="Bold" />}
              />
              <Button
                className="w-9 h-9"
                buttonType="bordered"
                type="button"
                onClick={() => {
                  navigator.push('admin/surveys');
                }}
                suffix={<CloseSquare size={20} variant="Bold" />}
              />
            </div>
          </PageBar>
          {tab == 0 ? <DetailTab survey={surveyData} /> : <></>}
          {tab == 1 ? (
            <ParticipantsTab
              participants={participantsData}
              survey={surveyData}
            />
          ) : (
            <></>
          )}
          {tab == 3 && surveyData.kind == 'questions' ? (
            <QuestionnairesTab survey={surveyData} />
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
  );
}
