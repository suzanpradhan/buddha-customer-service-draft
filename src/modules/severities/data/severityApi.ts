import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import { SeverityDetailType } from './severityTypes';

const severityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Severities
    getSeverities: builder.query<
      PaginatedResponseType<SeverityDetailType>,
      number
    >({
      query: (page = 1) => `${apiPaths.severitiesUrl}/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ slug }) => ({ type: 'Severities', slug } as const)
              ),
              { type: 'Severities', id: 'LIST' },
            ]
          : [{ type: 'Severities', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Severities
    getSeverity: builder.query<SeverityDetailType, string>({
      query: (slug) => `${apiPaths.severitiesUrl}/${slug}`,
      providesTags: (result, error, slug) => {
        return [{ type: 'Severities', slug }];
      },
    }),

    // Get All list of Severities
    getAllSeverities: builder.query<SeverityDetailType[], string>({
      query: (searchValue = '') =>
        `${apiPaths.severitiesUrl}/all?search=${searchValue}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ slug }) => ({ type: 'Severities', slug } as const)
              ),
              { type: 'Severities', id: 'LIST' },
            ]
          : [{ type: 'Severities', id: 'LIST' }],
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

    // Add new Severity
    addSeverity: builder.mutation<SeverityDetailType, SeverityDetailType | any>(
      {
        query: (payload) => ({
          url: `${apiPaths.severitiesUrl}/`,
          method: 'POST',
          body: payload,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        }),
        async onQueryStarted(payload, { queryFulfilled }) {
          try {
            await queryFulfilled;
            toast.success('Severity Created.');
          } catch (err) {
            console.log(err);
            toast.error('Failed creating a severity.');
          }
        },
        invalidatesTags: (result, error, { slug }) => [
          { type: 'Severities', slug },
        ],
        transformResponse: (response) => {
          return response as SeverityDetailType;
        },
      }
    ),

    // Update each Severity
    updateSeverity: builder.mutation<
      SeverityDetailType,
      Partial<SeverityDetailType>
    >({
      query: ({ slug, ...payload }) => ({
        url: `${apiPaths.severitiesUrl}/${slug}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Severities', slug },
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Severity Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a severity.');
        }
      },
      transformResponse: (response) => {
        return response as SeverityDetailType;
      },
    }),

    // Delete each Severity
    deleteSeverity: builder.mutation<void, SeverityDetailType>({
      query({ slug, ...payload }) {
        return {
          url: `${apiPaths.severitiesUrl}/${slug}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Severity Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a severity.');
        }
      },
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Severities', slug },
      ],
    }),
  }),
  overrideExisting: true,
});

export default severityApi;
