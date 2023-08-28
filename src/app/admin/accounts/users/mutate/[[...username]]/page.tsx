'use client';

import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import { Button, TextField } from '@/core/ui/zenbuddha/src';
import FormCard from '@/core/ui/zenbuddha/src/components/Forms/FormCard';
import FormGroup from '@/core/ui/zenbuddha/src/components/Forms/FormGroup';
import { nonempty } from '@/core/utils/formUtils';
import accountApi from '@/modules/accounts/data/accountApi';
import { AccountDetailType } from '@/modules/accounts/data/accountTypes';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { toFormikValidate } from 'zod-formik-adapter';

export default function MutateUserPage({
  params,
}: {
  params: { username: string };
}) {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const addAccountFormSchema = z.object({
    firstName: z.string().pipe(nonempty),
    lastName: z.string().pipe(nonempty),
    username: z.string().pipe(nonempty),
    email: z.string(),
    password: z.string().pipe(nonempty),
    confirmPassword: z.string().pipe(nonempty),
  });

  type AddAccountFormType = z.infer<typeof addAccountFormSchema>;

  useEffect(() => {
    if (params.username) {
      dispatch(accountApi.endpoints.getAccount.initiate(params.username[0]));
    }
  }, [params]);

  const toMutateAccountData = useGetApiResponse<AccountDetailType>(
    `getAccount("${params.username ? params.username[0] : undefined}")`
  );

  const onSubmit = async (values: AddAccountFormType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data = params.username
        ? await Promise.resolve(
            dispatch(
              accountApi.endpoints.updateAccount.initiate({
                email: values.email,
                username: params.username[0],
                password: values.password,
                profile: {
                  full_name: values.firstName + ' ' + values.lastName,
                },
              })
            )
          )
        : await Promise.resolve(
            dispatch(
              accountApi.endpoints.addAccount.initiate({
                email: values.email,
                username: values.username,
                is_staff: false,
                password: values.password,
                profile: {
                  full_name: values.firstName + ' ' + values.lastName,
                },
              })
            )
          );
      if (Object.prototype.hasOwnProperty.call(data, 'data')) {
        navigate.push('admin/accounts/users/all');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: toMutateAccountData
        ? toMutateAccountData.profile?.full_name
          ? toMutateAccountData.profile.full_name.split(' ')[0]
          : ''
        : '',
      lastName: toMutateAccountData
        ? toMutateAccountData.profile?.full_name
          ? toMutateAccountData.profile.full_name.split(' ')[1]
          : ''
        : '',
      username: toMutateAccountData ? toMutateAccountData.username ?? '' : '',
      email: toMutateAccountData ? toMutateAccountData.email ?? '' : '',
      password: '',
      confirmPassword: '',
    },
    validate: toFormikValidate(addAccountFormSchema),
    onSubmit,
  });

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Account">
        <div className="flex gap-2 mb-2">
          <div className="flex flex-col flex-1">
            <TextField
              id="firstName"
              type="text"
              label="First name"
              className="flex-1"
              {...formik.getFieldProps('firstName')}
            />
            {!!formik.errors.firstName && (
              <div className="text-red-500 text-sm">
                {formik.errors.firstName}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="lastName"
              type="text"
              label="Last name"
              className="flex-1"
              {...formik.getFieldProps('lastName')}
            />
            {!!formik.errors.lastName && (
              <div className="text-red-500 text-sm">
                {formik.errors.lastName}
              </div>
            )}
          </div>
        </div>
        {!params.username ? (
          <div className="flex flex-col mb-2">
            <TextField
              id="username"
              type="username"
              label="Username"
              className="flex-1"
              {...formik.getFieldProps('username')}
            />
            {!!formik.errors.username && (
              <div className="text-red-500 text-sm">
                {formik.errors.username}
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
        <div className="flex flex-col mb-2">
          <TextField
            id="email"
            type="email"
            label="Email Address"
            className="flex-1"
            {...formik.getFieldProps('email')}
          />
          {!!formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>
      </FormGroup>
      <FormGroup title="Security">
        <div className="flex gap-2 mb-2">
          <div className="flex flex-col flex-1">
            <TextField
              placeholder="•••••••••••"
              id="password"
              type="password"
              label={`${params.username ? 'New ' : ''}Password`}
              className="flex-1"
              {...formik.getFieldProps('password')}
            />
            {!!formik.errors.password && (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              placeholder="•••••••••••"
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              className="flex-1"
              {...formik.getFieldProps('confirmPassword')}
            />
            {!!formik.errors.password && (
              <div className="text-red-500 text-sm">
                {formik.errors.confirmPassword}
              </div>
            )}
          </div>
        </div>
      </FormGroup>
      <div className="flex justify-end gap-2 m-4">
        <Button
          text="Submit"
          className="h-8 w-fit"
          type="submit"
          isLoading={isLoading}
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
