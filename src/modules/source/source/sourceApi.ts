import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import { SourceDetailType } from './sourceTypes';

const sourceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Source
    getSources: builder.query<PaginatedResponseType<SourceDetailType>, number>({
      query: (page = 1) => `${apiPaths.sourcesUrl}/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ slug }) => ({ type: 'Sources', slug } as const)
              ),
              { type: 'Sources', id: 'LIST' },
            ]
          : [{ type: 'Sources', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Source
    getSource: builder.query<SourceDetailType, string>({
      query: (slug) => `${apiPaths.sourcesUrl}/${slug}`,
      providesTags: (result, error, slug) => {
        return [{ type: 'Sources', slug }];
      },
    }),

    // Get All list of Sources
    getAllSources: builder.query<SourceDetailType[], string>({
      query: (searchValue = '') =>
        `${apiPaths.sourcesUrl}/all?search=${searchValue}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ slug }) => ({ type: 'Sources', slug } as const)),
              { type: 'Sources', id: 'LIST' },
            ]
          : [{ type: 'Sources', id: 'LIST' }],
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

    // Add new Source
    addSource: builder.mutation<SourceDetailType, SourceDetailType | any>({
      query: (payload) => ({
        url: `${apiPaths.sourcesUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: [{ type: 'Sources', id: 'LIST' }],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Source Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a source.');
        }
      },
      transformResponse: (response) => {
        return response as SourceDetailType;
      },
    }),

    // Update each Source
    updateSource: builder.mutation<SourceDetailType, Partial<SourceDetailType>>(
      {
        query: ({ slug, ...payload }) => ({
          url: `${apiPaths.sourcesUrl}/${slug}/`,
          method: 'PATCH',
          body: payload,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        }),
        invalidatesTags: (result, error, { slug }) => [
          { type: 'Sources', slug },
        ],
        async onQueryStarted(payload, { queryFulfilled }) {
          try {
            await queryFulfilled;
            toast.success('Source Updated.');
          } catch (err) {
            console.log(err);
            toast.error('Failed updating a source.');
          }
        },
        transformResponse: (response) => {
          return response as SourceDetailType;
        },
      }
    ),

    // Delete each Source
    deleteSource: builder.mutation<void, SourceDetailType>({
      query({ slug, ...payload }) {
        return {
          url: `${apiPaths.sourcesUrl}/${slug}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Source Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a source.');
        }
      },
      invalidatesTags: (result, error, { slug }) => [{ type: 'Sources', slug }],
    }),
  }),
  overrideExisting: true,
});

export default sourceApi;
