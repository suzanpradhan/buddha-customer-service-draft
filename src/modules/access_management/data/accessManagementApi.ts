import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { toast } from 'react-toastify';
import {
  ContentKindType,
  PermissionType,
  RoleFormType,
  RoleType,
} from './accessManagementType';

const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Roles
    getAllRoles: builder.query<RoleType[], void>({
      query: () => `${apiPaths.rolesUrl}/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Roles', id } as const)),
              { type: 'Roles', id: 'LIST' },
            ]
          : [{ type: 'Roles', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get List of Permissions
    getAllPermissions: builder.query<PermissionType[], void>({
      query: () => `${apiPaths.permissionsUrl}/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ name }) => ({ type: 'Permissions', name } as const)
              ),
              { type: 'Permissions', id: 'LIST' },
            ]
          : [{ type: 'Permissions', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get List of Content Types
    getAllContentKinds: builder.query<ContentKindType[], void>({
      query: () => `${apiPaths.contentKindsUrl}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ model }) => ({ type: 'ContentTypes', model } as const)
              ),
              { type: 'ContentTypes', id: 'LIST' },
            ]
          : [{ type: 'ContentTypes', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Role
    getRole: builder.query<RoleType, string>({
      query: (id) => `${apiPaths.rolesUrl}/${id}/`,
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
          toast.error('Failed getting a role.');
        }
      },
      providesTags: (result, error, id) => {
        return [{ type: 'Roles', id }];
      },
    }),

    // Get each User Role
    getUserRolePermissions: builder.query<RoleType, string>({
      query: (username) => `${apiPaths.userRoleUrl}/${username}/`,
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
          toast.error('Failed getting a user permissions.');
        }
      },
      providesTags: ['UserPermissions'],
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Update each Role
    updateUserRolePermission: builder.mutation<RoleType, Partial<RoleFormType>>(
      {
        query: ({ id, ...payload }) => ({
          url: `${apiPaths.rolesUrl}/${id}/`,
          method: 'PATCH',
          body: {
            name: payload.name,
            permissions: payload.permissions?.map((permission) =>
              parseInt(permission)
            ),
          },
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Roles', id }],
        async onQueryStarted(payload, { queryFulfilled }) {
          try {
            await queryFulfilled;
            toast.success('Permission Updated.');
          } catch (err) {
            console.log(err);
            toast.error('Failed updating a role.');
          }
        },
        transformResponse: (response) => {
          return response as RoleType;
        },
      }
    ),

    // Get List of User Permissions
    getAllUserPermissions: builder.query<PermissionType[], void>({
      query: () => `${apiPaths.userRoleUrl}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ name }) => ({ type: 'UserPermissions', name } as const)
              ),
              { type: 'UserPermissions', id: 'LIST' },
            ]
          : [{ type: 'UserPermissions', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          var data = await queryFulfilled;
          console.log(data);
        } catch (err) {
          console.log(err);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Add new Role
    addRole: builder.mutation<RoleType, RoleType>({
      query: (payload) => ({
        url: `${apiPaths.rolesUrl}/`,
        method: 'POST',
        body: {
          name: payload.name,
          permissions: payload.permissions?.map((permission) =>
            parseInt(permission)
          ),
        },
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Role Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a role.');
        }
      },
      transformResponse: (response) => {
        return response as RoleType;
      },
    }),

    // Update each Role
    updateRole: builder.mutation<RoleType, Partial<RoleType>>({
      query: ({ id, ...payload }) => ({
        url: `${apiPaths.rolesUrl}/${id}/`,
        method: 'PATCH',
        body: {
          name: payload.name,
          permissions: payload.permissions?.map((permission) =>
            parseInt(permission)
          ),
        },
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: ['UserPermissions'],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Role Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a role.');
        }
      },
      transformResponse: (response) => {
        return response as RoleType;
      },
    }),

    // Delete each Role
    deleteRole: builder.mutation<void, RoleType>({
      query({ id }) {
        return {
          url: `${apiPaths.rolesUrl}/${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Role Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a role.');
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Roles', id }],
    }),
  }),
  overrideExisting: false,
});

export default rolesApi;
