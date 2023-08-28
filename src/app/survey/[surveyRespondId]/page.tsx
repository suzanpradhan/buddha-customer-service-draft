/* eslint-disable @next/next/no-img-element */
'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import {
  Button,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import clientSurveyApi from '@/modules/clientSurvey/clientSurveyApi';
import {
  ClientQuestionnaireAttemptFormType,
  ClientSurveyParticipantType,
  clientQuestionnaireAttemptFormSchema,
} from '@/modules/clientSurvey/clientSurveyTypes';
import { QuestionnairesDetailType } from '@/modules/survey/surveyTypes';
import { useFormik } from 'formik';
import { TickCircle } from 'iconsax-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function SurveyPage({
  params,
}: {
  params: { surveyRespondId?: string };
}) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    if (params.surveyRespondId) {
      dispatch(
        clientSurveyApi.endpoints.getSurveyParticipant.initiate(
          params.surveyRespondId
        )
      );
    }
  }, [dispatch, params.surveyRespondId]);

  const clientSurveyParticipantData = useAppSelector(
    (state: RootState) =>
      state.baseClientApi.queries[
        `getSurveyParticipant("${params.surveyRespondId}")`
      ]?.data as ClientSurveyParticipantType
  );

  useEffect(() => {
    if (clientSurveyParticipantData?.survey.ref_id) {
      dispatch(
        clientSurveyApi.endpoints.getQuestionnaire.initiate(
          clientSurveyParticipantData.survey.ref_id
        )
      );
    }
  }, [dispatch, clientSurveyParticipantData?.survey.ref_id]);

  const questionnaire = useAppSelector(
    (state: RootState) =>
      state.baseClientApi.queries[
        `getQuestionnaire("${clientSurveyParticipantData?.survey?.ref_id}")`
      ]?.data as QuestionnairesDetailType
  );

  const onSubmit = async (values: ClientQuestionnaireAttemptFormType) => {
    setIsLoading(true);
    try {
      if (params.surveyRespondId) {
        var responseData = await Promise.resolve(
          dispatch(clientSurveyApi.endpoints.submitSurvey.initiate(values))
        );
        if (responseData) {
          setSubmissionSuccess(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik<ClientQuestionnaireAttemptFormType>({
    enableReinitialize: true,
    initialValues: {
      survey_respond: params.surveyRespondId,
      questionnaire: questionnaire?.id,
      question_attempts:
        questionnaire?.questions.map((question) => ({
          answers: [
            {
              value: '',
            },
          ],
          question: question.id.toString(),
        })) ?? [],
    },
    validate: toFormikValidate(clientQuestionnaireAttemptFormSchema),
    onSubmit,
  });

  return clientSurveyParticipantData ? (
    <div className="flex flex-col items-center bg-whiteShade w-full h-screen">
      <div className="h-2 w-full bg-accent"></div>
      <div
        className={
          `w-full px-5 pb-5 bg-gradient-to-br from-accentBlue-500 to-accentBlue-400 flex flex-col items-center ` +
          (clientSurveyParticipantData.is_submitted
            ? 'flex-1'
            : 'min-h-[20rem]')
        }
      >
        <div className="max-w-5xl w-full flex justify-start mt-3">
          <img
            src="/logo/logo_white.png"
            alt="buddha_air_logo_white"
            className="object-contain w-[200px]"
          />
        </div>
        {!clientSurveyParticipantData.is_submitted ? (
          <div className="max-w-5xl w-full flex mt-9 relative">
            <div className="flex flex-col flex-1">
              <div className="text-blueWhite text-base">
                SURVEY #{clientSurveyParticipantData.survey.ref_id}
              </div>
              <h3 className="text-white font-bold text-2xl">
                {clientSurveyParticipantData.survey.title}
              </h3>
              <p className="text-blueWhite text-sm font-light mt-1">
                {`Flight: ${
                  clientSurveyParticipantData.flight?.title ?? '--'
                } • Station: ${
                  clientSurveyParticipantData.station?.name ?? '--'
                } • Started on: ${moment(
                  clientSurveyParticipantData.survey.start_date
                ).format('ll')}`}
              </p>
            </div>
            <div>
              <div className="flex items-start gap-4">
                <div className="flex flex-col h-fit items-end">
                  <div className="font-medium text-base text-white">
                    {clientSurveyParticipantData.profile?.full_name}
                  </div>
                  <div className="text-sm text-white">
                    {clientSurveyParticipantData.profile?.phone}
                  </div>
                  <div className="text-sm text-white">
                    {clientSurveyParticipantData.profile?.address}
                  </div>
                </div>
                {/* <div className="border w-12 h-12 border-primaryGray-300 rounded-md mr-2 flex justify-center items-center bg-white">
                <img
                  src={
                    clientSurveyParticipantData.profile?.avatar ??
                    '/images/avatar.jpg'
                  }
                  alt="avatar"
                  className="object-cover w-8 h-8 rounded-full"
                />
              </div> */}
              </div>
            </div>
            <div className="absolute max-w-5xl top-[calc(100%+1rem)] w-full m-auto flex flex-col">
              <div className="bg-white p-4 rounded-xl mb-4">
                {clientSurveyParticipantData.survey.description}
              </div>
              <div className="flex flex-col bg-white rounded-xl mb-5">
                <FormCard onSubmit={formik.handleSubmit}>
                  <FormGroup title="Questions">
                    {questionnaire?.questions.map((question, index) => (
                      <div
                        className="flex flex-col mb-2"
                        key={'question_' + question.id}
                      >
                        <TextField
                          id={'question_' + question.id}
                          type="text"
                          rows={2}
                          isMulti
                          label={question.question}
                          className="flex-1"
                          {...formik.getFieldProps(
                            `question_attempts[${index}].answers[0].value`
                          )}
                        />
                      </div>
                    ))}
                  </FormGroup>
                  <div className="flex justify-end gap-2 m-4">
                    <Button text="Submit" className="h-8 w-fit" type="submit" />
                  </div>
                </FormCard>
              </div>
            </div>
          </div>
        ) : isSubmissionSuccess ? (
          <div className="max-w-5xl w-full h-full flex items-center justify-center mt-9 relative">
            <div className="bg-white p-4 rounded-lg flex flex-col items-start">
              <div className="flex flex-col items-center w-full">
                <TickCircle
                  size={42}
                  variant="Broken"
                  className="text-accentBlue-500"
                />
                <div className="mt-2">Your survey has been recorded.</div>
              </div>
              <div className="text-dark-500 text-base mt-4">
                SURVEY #{clientSurveyParticipantData.survey.ref_id}
              </div>
              <h3 className="text-dark-500 font-bold text-base text-center">
                {clientSurveyParticipantData.survey.title}
              </h3>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl w-full h-full flex items-center justify-center mt-9 relative">
            <div className="bg-white p-4 rounded-lg flex flex-col items-start">
              <div className="text-dark-500">
                Survey session has been expired.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
