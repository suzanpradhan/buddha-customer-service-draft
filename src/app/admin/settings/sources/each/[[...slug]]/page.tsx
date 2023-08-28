'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import {
  Button,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import sourceApi from '@/modules/source/source/sourceApi';
import {
  SourceDetailType,
  sourceDetailSchema,
} from '@/modules/source/source/sourceTypes';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function AddNewSourcePage({
  params,
}: {
  params: { slug?: string };
}) {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.slug) {
      dispatch(sourceApi.endpoints.getSource.initiate(params.slug[0]));
    }
  }, [dispatch, params.slug]);

  const source = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getSource("${params.slug && params.slug[0]}")`]
        ?.data as SourceDetailType | undefined
  );

  const onSubmit = async (values: SourceDetailType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data = await Promise.resolve(
        params.slug
          ? dispatch(
              sourceApi.endpoints.updateSource.initiate({
                name: values.name,
                slug: params.slug[0],
              })
            )
          : dispatch(
              sourceApi.endpoints.addSource.initiate({
                name: values.name,
              })
            )
      );
      if (data) {
        navigate.push('admin/settings/sources');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: source ? source.name : '',
    },
    validate: toFormikValidate(sourceDetailSchema),
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
