'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import Selector from '@/core/ui/components/Selector';
import { Button, TextField } from '@/core/ui/zenbuddha/src';
import FormCard from '@/core/ui/zenbuddha/src/components/Forms/FormCard';
import FormGroup from '@/core/ui/zenbuddha/src/components/Forms/FormGroup';
import statusApi from '@/modules/status/data/statusApi';
import { statusKinds } from '@/modules/status/data/statusConstants';
import {
  StatusDetailType,
  StatusFormType,
  statusFormSchema,
} from '@/modules/status/data/statusTypes';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function AddNewStatusPage({
  params,
}: {
  params: { slug?: string };
}) {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.slug) {
      Promise.resolve(
        dispatch(statusApi.endpoints.getStatus.initiate(params.slug[0]))
      );
    }
  }, [dispatch, params.slug]);

  const status = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getStatus("${params.slug && params.slug[0]}")`]
        ?.data as StatusDetailType[] | undefined
  );

  const onSubmit = async (values: StatusFormType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      if (!values.kind) {
        setIsLoading(false);

        return;
      }
      await Promise.resolve(
        dispatch(
          statusApi.endpoints.addStatus.initiate({
            title: values.title,
            kinds: values.kind.map((each) => each.value),
          })
        )
      );
      navigate.push('admin/settings/status');
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  console.log(
    status
      ? status.map((each) => {
          return {
            value: each.kind ?? '',
            label: `${each.kind.charAt(0).toUpperCase()}${each.kind
              .slice(1)
              .toLowerCase()}`,
          };
        })
      : undefined
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: status ? status[0].title : '',
      kind: status
        ? status.map((each) => {
            return {
              value: each.kind ?? '',
              label: `${each.kind.charAt(0).toUpperCase()}${each.kind
                .slice(1)
                .toLowerCase()}`,
            };
          })
        : undefined,
    },
    validate: toFormikValidate(statusFormSchema),
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
          <Selector
            id="kind_selector"
            options={statusKinds}
            label="Status Kind"
            isMulti
            placeholder="Select or kinds"
            className="flex-1 mb-2"
            onChange={formik.setFieldValue}
            name="kind"
            required
            value={formik.values.kind}
          />
          {/* <Selector
            id="kind_selector"
            options={statusKinds}
            label="Status Type"
            placeholder="Select status type"
            className="flex-1 mb-2"
            onChange={formik.setFieldValue}
            name="kind"
            isMulti
            value={statusKinds.find((t) => t.value == formik.values.kind)}
            required
          ></Selector> */}
          {!!formik.errors.kind && (
            <div className="text-red-500 text-sm">{formik.errors.kind}</div>
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
