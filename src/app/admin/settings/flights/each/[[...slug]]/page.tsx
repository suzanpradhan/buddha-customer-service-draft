'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { Button, TextField } from '@/core/ui/zenbuddha/src';
import FormCard from '@/core/ui/zenbuddha/src/components/Forms/FormCard';
import FormGroup from '@/core/ui/zenbuddha/src/components/Forms/FormGroup';
import flightApi from '@/modules/flights/data/flightApi';
import {
  FlightDetailType,
  flightDetailSchema,
} from '@/modules/flights/data/flightTypes';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function AddNewFlightPage({
  params,
}: {
  params: { slug?: string };
}) {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.slug) {
      dispatch(flightApi.endpoints.getFlight.initiate(params.slug[0]));
    }
  }, [dispatch, params.slug]);

  const flight = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getFlight("${params.slug && params.slug[0]}")`]
        ?.data as FlightDetailType | undefined
  );

  const onSubmit = async (values: FlightDetailType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data = await Promise.resolve(
        params.slug
          ? dispatch(
              flightApi.endpoints.updateFlight.initiate({
                title: values.title,
                slug: params.slug[0],
                number: values.number,
              })
            )
          : dispatch(
              flightApi.endpoints.addFlight.initiate({
                title: values.title,
                number: values.number,
              })
            )
      );
      if (data) {
        navigate.push('admin/settings/flights');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: flight ? flight.title : '',
      number: flight ? flight.number : '',
    },
    validate: toFormikValidate(flightDetailSchema),
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
            {...formik.getFieldProps('title')}
          />
          {!!formik.errors.title && (
            <div className="text-red-500 text-sm">{formik.errors.title}</div>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <TextField
            id="number"
            type="text"
            label="Flight no."
            className="flex-1"
            {...formik.getFieldProps('number')}
          />
          {!!formik.errors.number && (
            <div className="text-red-500 text-sm">{formik.errors.number}</div>
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
