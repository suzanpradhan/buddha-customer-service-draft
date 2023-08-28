import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import { DepartmentDetailType } from './departmentTypes';

const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Departments
    getDepartments: builder.query<
      PaginatedResponseType<DepartmentDetailType>,
      number
    >({
      query: (page = 1) => `${apiPaths.departmentsUrl}/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ slug }) => ({ type: 'Departments', slug } as const)
              ),
              { type: 'Departments', id: 'LIST' },
            ]
          : [{ type: 'Departments', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    // Get each Department
    getDepartment: builder.query<DepartmentDetailType, string>({
      query: (slug) => `${apiPaths.departmentsUrl}/${slug}`,
      providesTags: (result, error, slug) => {
        return [{ type: 'Departments', slug }];
      },
    }),
    // Add new Department
    addDepartment: builder.mutation<
      DepartmentDetailType,
      DepartmentDetailType | any
    >({
      query: (payload) => ({
        url: `${apiPaths.departmentsUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: [{ type: 'Departments', id: 'LIST' }],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Department Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a department.');
        }
      },
      transformResponse: (response, meta, args) => {
        return response as DepartmentDetailType;
      },
    }),
    // Update each Department
    updateDepartment: builder.mutation<
      DepartmentDetailType,
      Partial<DepartmentDetailType>
    >({
      query: ({ slug, ...payload }) => ({
        url: `${apiPaths.departmentsUrl}/${slug}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Departments', slug },
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Department Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a department.');
        }
      },
      transformResponse: (response, meta, args) => {
        return response as DepartmentDetailType;
      },
    }),
    // Delete each DEpartment
    deleteDepartment: builder.mutation<void, DepartmentDetailType>({
      query({ slug, ...payload }) {
        return {
          url: `${apiPaths.departmentsUrl}/${slug}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Department Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a department.');
        }
      },
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Departments', slug },
      ],
    }),
  }),
  overrideExisting: false,
});

export default departmentApi;
