/* eslint-disable @next/next/no-img-element */
'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { SelectorDataType } from '@/core/types/selectorTypes';
import Selector from '@/core/ui/components/Selector';
import { Button, DateSelector, TextField } from '@/core/ui/zenbuddha/src';
import FormCard from '@/core/ui/zenbuddha/src/components/Forms/FormCard';
import FormGroup from '@/core/ui/zenbuddha/src/components/Forms/FormGroup';
import accountApi from '@/modules/accounts/data/accountApi';
import { AccountDetailType } from '@/modules/accounts/data/accountTypes';
import spotCheckApi from '@/modules/spotcheck/spotcheckApi';
import {
  SpotCheckDetailType,
  SpotCheckFormType,
  spotCheckFormSchema,
} from '@/modules/spotcheck/spotcheckTypes';
import stationApi from '@/modules/station/data/stationApi';
import { StationDetailType } from '@/modules/station/data/stationTypes';
import { useFormik } from 'formik';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function SpotCheckMutationPage({
  params,
}: {
  params: { ref_id?: string };
}) {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(stationApi.endpoints.getAllStations.initiate(''));
    dispatch(accountApi.endpoints.getAllUsers.initiate());
  }, [dispatch]);

  useEffect(() => {
    if (params.ref_id) {
      Promise.resolve(
        dispatch(spotCheckApi.endpoints.getSpotCheck.initiate(params.ref_id[0]))
      );
    }
  }, [dispatch, params.ref_id]);

  const allStations = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllStations`]?.data as StationDetailType[]
  );

  const allUsers = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllUsers`]?.data as AccountDetailType[]
  );

  const spotcheck = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[
        `getSpotCheck("${params.ref_id && params.ref_id[0]}")`
      ]?.data as SpotCheckDetailType | undefined
  );

  const formatOptionLabel = (props: SelectorDataType) => {
    return (
      <div className="flex gap-2 items-center">
        <img
          src={props.extra ?? '/images/avatar.jpg'}
          alt="avatar"
          className="object-cover w-6 h-6 rounded-md"
        />
        <div>{props.label}</div>
      </div>
    );
  };

  const onSubmit = async (values: SpotCheckFormType) => {
    if (values.date) {
      values.date = moment(values.date).format('YYYY-MM-DD');
    }
    setIsLoading(true);
    try {
      var data = await Promise.resolve(
        params.ref_id
          ? dispatch(
              spotCheckApi.endpoints.updateSpotCheck.initiate({
                ref_id: params.ref_id[0],
                ...values,
              })
            )
          : dispatch(spotCheckApi.endpoints.addSpotCheck.initiate(values))
      );
      navigate.push('admin/spotchecks');
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: spotcheck?.title ? spotcheck.title : '',
      description: spotcheck?.description ? spotcheck.description : undefined,
      date: spotcheck?.date ? moment(spotcheck.date).toDate() : undefined,
      assignee: spotcheck?.assignee
        ? spotcheck?.assignee.id!.toString()
        : undefined,
      station: spotcheck?.station
        ? spotcheck?.station.id!.toString()
        : undefined,
    },
    validate: toFormikValidate(spotCheckFormSchema),
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
          <DateSelector
            id="date"
            label="Survey Date"
            required
            {...formik.getFieldProps('date')}
            onChange={(date) => {
              formik.setFieldValue('date', date);
            }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          {allUsers && (
            <Selector
              id="assignee_selector"
              options={allUsers?.map(
                (user) =>
                  ({
                    value: user.id!.toString(),
                    label: user.username,
                    extra: user.profile?.avatar,
                  } as SelectorDataType)
              )}
              label="Assignee"
              formatOptionLabel={formatOptionLabel}
              placeholder="Select or create assignee"
              className="flex-1 mb-2"
              onChange={formik.setFieldValue}
              name="assignee"
            ></Selector>
          )}
          {allStations && (
            <Selector
              id="station_selector"
              options={allStations?.map(
                (station) =>
                  ({
                    value: station.id!.toString(),
                    label: station.name,
                  } as SelectorDataType)
              )}
              label="Station"
              placeholder="Select or create station"
              className="flex-1 mb-2"
              onChange={formik.setFieldValue}
              name="station"
            ></Selector>
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
