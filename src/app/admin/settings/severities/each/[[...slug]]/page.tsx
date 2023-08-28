'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { Button, TextField } from '@/core/ui/zenbuddha/src';
import FormCard from '@/core/ui/zenbuddha/src/components/Forms/FormCard';
import FormGroup from '@/core/ui/zenbuddha/src/components/Forms/FormGroup';
import severityApi from '@/modules/severities/data/severityApi';
import {
  SeverityDetailType,
  severityDetailSchema,
} from '@/modules/severities/data/severityTypes';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function AddNewSeverityPage({
  params,
}: {
  params: { slug?: string };
}) {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.slug) {
      dispatch(severityApi.endpoints.getSeverity.initiate(params.slug[0]));
    }
  }, [dispatch, params.slug]);

  const severity = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getSeverity("${params.slug && params.slug[0]}")`]
        ?.data as SeverityDetailType | undefined
  );

  const onSubmit = async (values: SeverityDetailType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data = await Promise.resolve(
        params.slug
          ? dispatch(
              severityApi.endpoints.updateSeverity.initiate({
                name: values.name,
                slug: params.slug[0],
                level: values.level,
              })
            )
          : dispatch(
              severityApi.endpoints.addSeverity.initiate({
                name: values.name,
                level: values.level,
              })
            )
      );
      if (data) {
        navigate.push('admin/settings/severities');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: severity ? severity.name : '',
      level: severity ? severity.level : 0,
    },
    validate: toFormikValidate(severityDetailSchema),
    onSubmit,
  });

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="General">
        <div className="flex flex-col mb-2">
          <TextField
            id="name"
            type="text"
            label="Name"
            className="flex-1"
            {...formik.getFieldProps('name')}
          />
          {!!formik.errors.name && (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <TextField
            id="level"
            type="number"
            label="Level"
            className="flex-1"
            {...formik.getFieldProps('level')}
          />
          {!!formik.errors.level && (
            <div className="text-red-500 text-sm">{formik.errors.level}</div>
          )}
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
