import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import {
  ComplainDetailType,
  ComplainFormType,
  ComplainRequestType,
} from './complainTypes';
import { ResolutionType, UpdateTicketStatusType } from './ticketTypes';

const complainsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Complains
    getComplains: builder.query<
      PaginatedResponseType<ComplainDetailType>,
      number
    >({
      query: (page = 1) =>
        `${apiPaths.ticketsUrl}/?kind__in=complain&page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ ref_id }) => ({ type: 'Complains', id: ref_id } as const)
              ),
              { type: 'Complains', id: 'LIST' },
            ]
          : [{ type: 'Complains', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Complain
    getComplain: builder.query<ComplainFormType, string>({
      query: (ref_id) => `${apiPaths.ticketsUrl}/${ref_id}/?kind__in=complain`,
      providesTags: (result, error, ref_id) => {
        return [{ type: 'Complains', id: ref_id }];
      },
    }),

    // Update Complain Status
    updateComplainStatus: builder.mutation<
      ComplainDetailType,
      Partial<UpdateTicketStatusType>
    >({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.ticketsUrl}/${ref_id}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => [
        { type: 'Complains', id: ref_id },
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Complain Status Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating complain status.');
        }
      },
      transformResponse: (response) => {
        return response as ComplainDetailType;
      },
    }),

    // Delete Complain
    deleteComplain: builder.mutation<void, string>({
      query(ref_id) {
        return {
          url: `${apiPaths.ticketsUrl}/${ref_id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Complain Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a complain.');
        }
      },
      invalidatesTags: (result, error, ref_id) => [
        { type: 'Complains', id: 'LIST' },
      ],
    }),

    // Add new Complain
    addComplain: builder.mutation<any, ComplainRequestType>({
      query: (payload) => ({
        url: `${apiPaths.ticketsUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: [{ type: 'Complains', id: 'LIST' }],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Complain Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a complain.');
        }
      },
      transformResponse: (response) => {
        return response as any;
      },
    }),

    // Update Complain
    updateComplain: builder.mutation<any, ComplainRequestType>({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.ticketsUrl}/${ref_id}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => [
        { type: 'Complains', id: ref_id },
        { type: 'Attachments', id: 'LIST' },
        'Attachments',
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Complain Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a complain.');
        }
      },
      transformResponse: (response) => {
        return response as any;
      },
    }),

    // Get List of Complain Resolutions
    getComplainResolutionsList: builder.query<
      PaginatedResponseType<ResolutionType>,
      { page: number; ref_id: string }
    >({
      query: ({ page = 1, ref_id }) =>
        `${apiPaths.ticketsUrl}/${ref_id}/resolutions/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ id }) => ({ type: 'ComplainResolutions', id } as const)
              ),
              { type: 'ComplainResolutions', id: 'LIST' },
            ]
          : [{ type: 'ComplainResolutions', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Add new Complain Resolution
    addComplainResolution: builder.mutation<
      ResolutionType,
      ResolutionType | any
    >({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.ticketsUrl}/${ref_id}/resolutions/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => {
        return [
          { type: 'Complains', id: ref_id },
          { type: 'ComplainResolutions', id: 'LIST' },
        ];
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Resolution Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a resolution.');
        }
      },
      transformResponse: (response) => {
        return response as ResolutionType;
      },
    }),

    //   // Delete Ticket Resolution
    //   deleteResolutions: builder.mutation<void, ResolutionType>({
    //     query({ id, ...payload }) {
    //       return {
    //         url: `${apiPaths.ticketsUrl}/resolutions/${id}`,
    //         method: 'DELETE',
    //       };
    //     },
    //     async onQueryStarted(payload, { queryFulfilled }) {
    //       try {
    //         await queryFulfilled;
    //         toast.success('Resolution Deleted.');
    //       } catch (err) {
    //         console.log(err);
    //         toast.error('Failed deleting a resolution.');
    //       }
    //     },
    //     invalidatesTags: (result, error, { id }) => {
    //       return [
    //         { type: 'Resolutions', id: id },
    //         { type: 'Resolutions', id: 'LIST' },
    //       ];
    //     },
    //   }),
  }),
  overrideExisting: true,
});

export default complainsApi;
