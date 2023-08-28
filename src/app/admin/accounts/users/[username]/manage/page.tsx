'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { Button, Checkbox, FormCard, FormGroup } from '@/core/ui/zenbuddha/src';
import rolesApi from '@/modules/access_management/data/accessManagementApi';
import {
  ContentKindType,
  PermissionType,
  RoleType,
  roleSchema,
} from '@/modules/access_management/data/accessManagementType';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function UserManagePage({
  params,
}: {
  params: { username: string };
}) {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(rolesApi.endpoints.getAllPermissions.initiate());
    dispatch(rolesApi.endpoints.getAllContentKinds.initiate());
    dispatch(
      rolesApi.endpoints.getUserRolePermissions.initiate(params.username)
    );
  }, [dispatch, params]);

  const permissionsData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllPermissions`]?.data as PermissionType[]
  );

  const contentTypesData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllContentKinds`]?.data as ContentKindType[]
  );

  const role = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getUserRolePermissions("${params.username}")`]
        ?.data as RoleType | undefined
  );

  const onSubmit = async (values: RoleType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data = await Promise.resolve(
        dispatch(
          rolesApi.endpoints.updateRole.initiate({
            id: role?.id,
            ...values,
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
        <div className="flex flex-col max-w-3xl gap-4">
          {contentTypesData?.map((contentType, index) => {
            if (contentType.permissions.length <= 0) {
              return <></>;
            }
            return (
              <div className="flex gap-2 items-start" key={index}>
                <div className="flex-1 capitalize">{contentType.model}</div>
                <div className="flex-[2] flex flex-wrap justify-end gap-4">
                  {contentType.permissions.map((permission, index) => {
                    return (
                      <Checkbox
                        id={permission.id.toString()}
                        key={index}
                        value={permission.id.toString()}
                        checked={
                          formik.values.permissions?.includes(
                            permission.id.toString()
                          ) || formik.values.selectAll
                        }
                        onChange={(e) => {
                          if (formik.values.selectAll) {
                            formik.setFieldValue(
                              'selectAll',
                              !formik.values.selectAll
                            );
                          }
                          formik.handleChange(e);
                        }}
                        label={permission.codename
                          ?.substring(0, permission.codename?.lastIndexOf('_'))
                          .split('_')
                          .join(' ')}
                        name="permissions"
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
        </div> */}
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
