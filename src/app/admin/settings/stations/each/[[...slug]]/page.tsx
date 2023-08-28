'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import {
  Button,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import stationApi from '@/modules/station/data/stationApi';
import {
  StationDetailType,
  stationDetailSchema,
} from '@/modules/station/data/stationTypes';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function AddNewStationPage({
  params,
}: {
  params: { slug?: string };
}) {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.slug) {
      dispatch(stationApi.endpoints.getStation.initiate(params.slug[0]));
    }
  }, [dispatch, params.slug]);

  const station = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getStation("${params.slug && params.slug[0]}")`]
        ?.data as StationDetailType | undefined
  );

  const onSubmit = async (values: StationDetailType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data = await Promise.resolve(
        params.slug
          ? dispatch(
              stationApi.endpoints.updateStation.initiate({
                name: values.name,
                slug: params.slug[0],
              })
            )
          : dispatch(
              stationApi.endpoints.addStation.initiate({
                name: values.name,
              })
            )
      );
      if (data) {
        navigate.push('admin/settings/stations');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: station ? station.name : '',
    },
    validate: toFormikValidate(stationDetailSchema),
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
