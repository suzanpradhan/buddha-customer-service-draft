'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import {
  Button,
  Checkbox,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import rolesApi from '@/modules/access_management/data/accessManagementApi';
import {
  PermissionType,
  RoleType,
  roleSchema,
} from '@/modules/access_management/data/accessManagementType';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function AddNewRolePage({
  params,
}: {
  params: { id?: string };
}) {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(rolesApi.endpoints.getAllPermissions.initiate());
    if (params.id) {
      dispatch(rolesApi.endpoints.getRole.initiate(params.id[0]));
    }
  }, [dispatch, params]);

  const permissionsData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllPermissions`]?.data as PermissionType[]
  );

  const role = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getRole("${params.id && params.id[0]}")`]?.data as
        | RoleType
        | undefined
  );

  const onSubmit = async (values: RoleType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data = await Promise.resolve(
        params.id
          ? dispatch(
              rolesApi.endpoints.updateRole.initiate({
                id: params.id,
                ...values,
              })
            )
          : dispatch(rolesApi.endpoints.addRole.initiate(values))
      );
      if (Object.prototype.hasOwnProperty.call(data, 'data')) {
        navigate.push('admin/access/roles');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      selectAll: false,
      name: role ? role.name : '',
      permissions:
        role?.permissions?.map((permission) => permission.toString()) ?? [],
    },
    validate: toFormikValidate(roleSchema),
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
      <FormGroup title="Permissions">
        <div className="flex items-center justify-between h-10 bg-whiteShade px-4 rounded-md mb-4 text-sm">
          <label htmlFor="all_permissions" className="cursor-pointer">
            Select all permissions
          </label>
          {permissionsData ? (
            <Checkbox
              id="all_permissions"
              checked={formik.values.selectAll}
              name="selectAll"
              value={permissionsData
                .map((permission) => permission.id)
                .toString()}
              onChange={(event) => {
                const isChecked = event.target.checked;
                if (isChecked) {
                  formik.setFieldValue(
                    'permissions',
                    permissionsData.map((permission) =>
                      permission.id.toString()
                    )
                  );
                } else {
                  formik.setFieldValue('permissions', []);
                }
                formik.setFieldValue('selectAll', isChecked);
              }}
            />
          ) : (
            <></>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {permissionsData?.map((permission, index) => (
            <Checkbox
              id={permission.id!.toString()}
              label={permission.name}
              key={index}
              name="permissions"
              value={permission.id.toString()}
              checked={
                formik.values.permissions?.includes(permission.id.toString()) ||
                formik.values.selectAll
              }
              onChange={(e) => {
                if (formik.values.selectAll) {
                  formik.setFieldValue('selectAll', !formik.values.selectAll);
                }
                formik.handleChange(e);
              }}
            />
          ))}
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
