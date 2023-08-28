import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import { StatusDetailType, StatusRequestSchema } from './statusTypes';

const statusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Status
    getStatusList: builder.query<
      PaginatedResponseType<StatusDetailType>,
      number
    >({
      query: (page = 1) => `${apiPaths.statusUrl}/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ slug }) => ({ type: 'Status', slug } as const)
              ),
              { type: 'Status', id: 'LIST' },
            ]
          : [{ type: 'Status', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Status
    getStatus: builder.query<StatusDetailType[], string>({
      query: (slug) => `${apiPaths.statusUrl}/${slug}/`,
      providesTags: (result, error, slug) => {
        return [{ type: 'Status', slug }];
      },
    }),

    // Get All list of Status
    getAllStatusForReports: builder.query<StatusDetailType[], void>({
      query: () => `${apiPaths.statusUrl}/all?kind__in=report`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ slug }) => ({ type: 'Status', slug } as const)),
              { type: 'Status', id: 'LIST' },
            ]
          : [{ type: 'Status', id: 'LIST' }],
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

    // Get All list of Status for Complain
    getAllStatusForComplains: builder.query<StatusDetailType[], void>({
      query: () => `${apiPaths.statusUrl}/all?kind__in=complain`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ slug }) => ({ type: 'Status', slug } as const)),
              { type: 'Status', id: 'LIST' },
            ]
          : [{ type: 'Status', id: 'LIST' }],
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

    // Get All list of Status for Lost and Found
    getAllStatusForLostAndFound: builder.query<StatusDetailType[], void>({
      query: () => `${apiPaths.statusUrl}/all?kind__in=lost,found`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ slug }) => ({ type: 'Status', slug } as const)),
              { type: 'Status', id: 'LIST' },
            ]
          : [{ type: 'Status', id: 'LIST' }],
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

    // Get All list of Status for Repair
    getAllStatusForRepairs: builder.query<StatusDetailType[], void>({
      query: () => `${apiPaths.statusUrl}/all?kind__in=repair`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ slug }) => ({ type: 'Status', slug } as const)),
              { type: 'Status', id: 'LIST' },
            ]
          : [{ type: 'Status', id: 'LIST' }],
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

    // Add new Status
    addStatus: builder.mutation<StatusDetailType[], StatusRequestSchema>({
      query: (payload) => ({
        url: `${apiPaths.statusUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: [{ type: 'Status', id: 'LIST' }],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Status Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a status.');
        }
      },
      transformResponse: (response) => {
        return response as StatusDetailType[];
      },
    }),

    // Update each Status
    updateStatus: builder.mutation<StatusDetailType, Partial<StatusDetailType>>(
      {
        query: ({ slug, ...payload }) => ({
          url: `${apiPaths.statusUrl}/${slug}/`,
          method: 'PATCH',
          body: payload,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        }),
        invalidatesTags: (result, error, { slug }) => [
          { type: 'Status', slug },
        ],
        async onQueryStarted(payload, { queryFulfilled }) {
          try {
            await queryFulfilled;
            toast.success('Station Status.');
          } catch (err) {
            console.log(err);
            toast.error('Failed updating a status.');
          }
        },
        transformResponse: (response) => {
          return response as StatusDetailType;
        },
      }
    ),
    // Delete each Status
    deleteStatus: builder.mutation<void, StatusDetailType>({
      query({ slug, ...payload }) {
        return {
          url: `${apiPaths.statusUrl}/${slug}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Status Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a status.');
        }
      },
      invalidatesTags: (result, error, { slug }) => [{ type: 'Status', slug }],
    }),
  }),
  overrideExisting: true,
});

export default statusApi;
