'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import Selector from '@/core/ui/components/Selector';
import { Button, DateSelector, TextField } from '@/core/ui/zenbuddha/src';
import FormCard from '@/core/ui/zenbuddha/src/components/Forms/FormCard';
import FormGroup from '@/core/ui/zenbuddha/src/components/Forms/FormGroup';
import surveyApi from '@/modules/survey/surveyApi';
import {
  SurveyDetailType,
  surveyDetailSchema,
} from '@/modules/survey/surveyTypes';
import { useFormik } from 'formik';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function SurveyEachPage({
  params,
}: {
  params: { ref_id?: string };
}) {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.ref_id) {
      Promise.resolve(
        dispatch(surveyApi.endpoints.getSurvey.initiate(params.ref_id[0]))
      );
    }
  }, [dispatch, params.ref_id]);

  const allKinds = [
    { label: 'Evaluation', value: 'evaluation' },
    { label: 'Questions', value: 'questions' },
  ];

  const survey = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getSurvey("${params.ref_id && params.ref_id[0]}")`]
        ?.data as SurveyDetailType | undefined
  );

  const onSubmit = async (values: SurveyDetailType) => {
    if (values.start_date) {
      values.start_date = moment(values.start_date).format('YYYY-MM-DD');
    }
    if (values.end_date) {
      values.end_date = moment(values.end_date).format('YYYY-MM-DD');
    }
    setIsLoading(true);
    try {
      var data = await Promise.resolve(
        params.ref_id
          ? dispatch(
              surveyApi.endpoints.updateSurvey.initiate({
                ref_id: params.ref_id[0],
                ...values,
              })
            )
          : dispatch(surveyApi.endpoints.addSurvey.initiate(values))
      );
      navigate.push('admin/surveys');
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: survey?.title ? survey.title : '',
      description: survey?.description ? survey.description : undefined,
      kind: survey?.kind ? survey.kind : 'evaluation',
      start_date: survey?.start_date
        ? moment(survey.start_date).toDate()
        : undefined,
      end_date: survey?.end_date ? moment(survey.end_date).toDate() : undefined,
    },
    validate: toFormikValidate(surveyDetailSchema),
    onSubmit,
  });

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="General">
        <div className="flex flex-col mb-2">
          <TextField
            id="title"
            type="text"
            label="Title"
            className="flex-1"
            required
            {...formik.getFieldProps('title')}
          />
          {!!formik.errors.title && (
            <div className="text-red-500 text-sm">{formik.errors.title}</div>
          )}
        </div>
        <div className="flex flex-col mb-2">
          <TextField
            id="description"
            type="text"
            isMulti
            rows={3}
            label="Description"
            className="flex-1"
            {...formik.getFieldProps('description')}
          />
          {!!formik.errors.description && (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          )}
        </div>
        <div className="flex flex-col mb-2">
          <Selector
            defaultValue={
              survey?.kind
                ? allKinds.filter((kind) => kind.value == survey.kind)[0]
                : allKinds[0]
            }
            id="kind_selector"
            type="Select"
            options={allKinds}
            label="Lost or Found"
            placeholder="Select kind"
            className="flex-1"
            onChange={formik.setFieldValue}
            name="kind"
          />
        </div>
      </FormGroup>
      <FormGroup title="Time Frames">
        <div className="flex flex-col mb-2">
          <DateSelector
            id="start_date"
            label="Start Date"
            required
            {...formik.getFieldProps('start_date')}
            onChange={(start_date) => {
              formik.setFieldValue('start_date', start_date);
            }}
          />
        </div>
        <div className="flex flex-col mb-2">
          <DateSelector
            id="end_date"
            label="End Date"
            required
            {...formik.getFieldProps('end_date')}
            onChange={(end_date) => {
              formik.setFieldValue('end_date', end_date);
            }}
          />
        </div>
      </FormGroup>
      <div className="flex justify-end gap-2 m-4">
        <Button
          text="Submit"
          isLoading={isLoading}
          className="h-8 w-fit"
          type="submit"
        />
        <Button
          text="Cancel"
          className="h-8 w-fit"
          buttonType="bordered"
          onClick={() => {
            navigate.back();
          }}
        />
      </div>
    </FormCard>
  );
}
