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
  ClientSurveyFeedbackFormItemType,
  ClientSurveyFeedbackFormType,
  ClientSurveyParticipantType,
  clientSurveyFeedbackFormSchema,
} from '@/modules/clientSurvey/clientSurveyTypes';
import { useFormik } from 'formik';
import { Add, TickCircle } from 'iconsax-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function FeedbackSurveyPage({
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

  const onSubmit = async (values: ClientSurveyFeedbackFormType) => {
    var evaluations: ClientSurveyFeedbackFormItemType[] = values.positives
      .filter((positive) => positive.text && positive.text != '')
      .concat(
        values.negatives.filter(
          (negative) => negative.text && negative.text != ''
        )
      )
      .concat(
        values.recommendations.filter(
          (recommendation) => recommendation.text && recommendation.text != ''
        )
      );
    setIsLoading(true);
    try {
      if (params.surveyRespondId) {
        var responseData = await Promise.resolve(
          dispatch(
            clientSurveyApi.endpoints.submitSurveyFeedback.initiate({
              survey_respond: params.surveyRespondId,
              evaluations: evaluations,
            })
          )
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

  const formik = useFormik<ClientSurveyFeedbackFormType>({
    enableReinitialize: true,
    initialValues: {
      positives: [
        {
          key: 0,
          kind: 'positive',
        },
        {
          key: 1,
          kind: 'positive',
        },
        {
          key: 2,
          kind: 'positive',
        },
      ],
      negatives: [
        {
          key: 0,
          kind: 'negative',
        },
        {
          key: 1,
          kind: 'negative',
        },
        {
          key: 2,
          kind: 'negative',
        },
      ],
      recommendations: [
        {
          key: 0,
          kind: 'recommendation',
        },
        {
          key: 1,
          kind: 'recommendation',
        },
        {
          key: 2,
          kind: 'recommendation',
        },
      ],
    },
    validate: toFormikValidate(clientSurveyFeedbackFormSchema),
    onSubmit,
  });

  const createAdditionalEvaluation = (
    kind: 'positive' | 'negative' | 'recommendation'
  ) => {
    formik.setFieldValue(`${kind}s`, [
      ...formik.values[`${kind}s`],
      { key: formik.values[`${kind}s`].length + 1, kind: kind },
    ]);
  };

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
                  <FormGroup title="Positive Feedbacks">
                    {formik.values.positives.map((positive, index) => (
                      <div
                        className="flex flex-col mb-2"
                        key={'positive_' + positive.key}
                      >
                        <TextField
                          id={`positive${positive.key}`}
                          type="text"
                          rows={2}
                          isMulti
                          className="flex-1"
                          {...formik.getFieldProps(`positives.[${index}].text`)}
                        />
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        createAdditionalEvaluation('positive');
                      }}
                      prefix={<Add className="text-black" />}
                      className="h-8 w-full bg-whiteShade"
                      type="button"
                    />
                  </FormGroup>
                  <FormGroup title="Negative Feedbacks">
                    {formik.values.negatives.map((negative, index) => (
                      <div
                        className="flex flex-col mb-2"
                        key={'negative_' + negative.key}
                      >
                        <TextField
                          id={`negative${negative.key}`}
                          type="text"
                          rows={2}
                          isMulti
                          className="flex-1"
                          {...formik.getFieldProps(`negatives.[${index}].text`)}
                        />
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        createAdditionalEvaluation('negative');
                      }}
                      prefix={<Add className="text-black" />}
                      className="h-8 w-full bg-whiteShade"
                      type="button"
                    />
                  </FormGroup>
                  <FormGroup title="Recommendation">
                    {formik.values.recommendations.map(
                      (recommendation, index) => (
                        <div
                          className="flex flex-col mb-2"
                          key={'recommendation_' + recommendation.key}
                        >
                          <TextField
                            id={`recommendation${recommendation.key}`}
                            type="text"
                            rows={2}
                            isMulti
                            className="flex-1"
                            {...formik.getFieldProps(
                              `recommendations.[${index}].text`
                            )}
                          />
                        </div>
                      )
                    )}
                    <Button
                      isLoading={isLoading}
                      onClick={() => {
                        createAdditionalEvaluation('recommendation');
                      }}
                      prefix={<Add className="text-black" />}
                      className="h-8 w-full bg-whiteShade"
                      type="button"
                    />
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
                <div className="mt-2">Your feedback has been recorded.</div>
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
