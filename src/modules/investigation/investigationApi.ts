import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import { InvestigationDetailType } from './investigationType';

const investigationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Investigations
    getInvestigationList: builder.query<
      PaginatedResponseType<InvestigationDetailType>,
      { page: number; ref_id: string }
    >({
      query: ({ page = 1, ref_id }) =>
        `${apiPaths.ticketsUrl}/${ref_id}/investigations/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ id }) => ({ type: 'Investigations', id } as const)
              ),
              { type: 'Investigations', id: 'LIST' },
            ]
          : [{ type: 'Investigations', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Add new Investigation
    addInvestigation: builder.mutation<
      InvestigationDetailType,
      InvestigationDetailType | any
    >({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.ticketsUrl}/${ref_id}/investigations/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: [{ type: 'Investigations', id: 'LIST' }],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Investigation Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a investigation.');
        }
      },
      transformResponse: (response) => {
        return response as InvestigationDetailType;
      },
    }),

    // Update each Investigation
    updateInvestigation: builder.mutation<
      InvestigationDetailType,
      Partial<InvestigationDetailType>
    >({
      query: ({ id, ...payload }) => ({
        url: `${apiPaths.ticketsUrl}/investigations/${id}`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Investigations', id },
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Investigation Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a investigation.');
        }
      },
      transformResponse: (response) => {
        return response as InvestigationDetailType;
      },
    }),

    // Delete Ticket Remarks
    deleteInvestigation: builder.mutation<void, InvestigationDetailType>({
      query({ id, ...payload }) {
        return {
          url: `${apiPaths.ticketsUrl}/investigations/${id}`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Investigation Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a investigation.');
        }
      },
      invalidatesTags: (result, error, { id }) => {
        return [{ type: 'Investigations', id: id }];
      },
    }),
  }),
  overrideExisting: true,
});

export default investigationApi;
