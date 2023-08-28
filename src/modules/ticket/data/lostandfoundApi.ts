import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import {
  LostAndFoundDetailType,
  LostAndFoundRequestType,
  ProductDetailType,
} from './lostandfoundTypes';
import { ResolutionType, UpdateTicketStatusType } from './ticketTypes';

const lostandfoundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Lost and Found
    getLostAndFoundList: builder.query<
      PaginatedResponseType<LostAndFoundDetailType>,
      number
    >({
      query: (page = 1) =>
        `${apiPaths.ticketsUrl}/?kind__in=lost,found&page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ ref_id }) => ({ type: 'LostAndFounds', id: ref_id } as const)
              ),
              { type: 'LostAndFounds', id: 'LIST' },
            ]
          : [{ type: 'LostAndFounds', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Lost and Found
    getLostAndFound: builder.query<LostAndFoundDetailType, string>({
      query: (ref_id) =>
        `${apiPaths.ticketsUrl}/${ref_id}/?kind__in=lost,found`,
      providesTags: (result, error, ref_id) => {
        return [{ type: 'LostAndFounds', id: ref_id }];
      },
    }),

    // Update Lost and Found Status
    updateLostAndFoundStatus: builder.mutation<
      LostAndFoundDetailType,
      Partial<UpdateTicketStatusType>
    >({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.ticketsUrl}/${ref_id}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => [
        { type: 'LostAndFounds', id: ref_id },
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Status Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating status.');
        }
      },
      transformResponse: (response) => {
        return response as LostAndFoundDetailType;
      },
    }),

    // Delete Lost and Found
    deleteLostAndFound: builder.mutation<void, string>({
      query(ref_id) {
        return {
          url: `${apiPaths.ticketsUrl}/${ref_id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Ticket Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a ticket.');
        }
      },
      invalidatesTags: (result, error, ref_id) => [
        { type: 'LostAndFounds', id: 'LIST' },
      ],
    }),

    // Add new Lost and Found
    addLostAndFound: builder.mutation<
      LostAndFoundDetailType,
      LostAndFoundRequestType
    >({
      query: (payload) => ({
        url: `${apiPaths.ticketsUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: [{ type: 'LostAndFounds', id: 'LIST' }],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Lost and found ticket Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a lost and found ticket.');
        }
      },
      transformResponse: (response) => {
        return response as LostAndFoundDetailType;
      },
    }),

    // Update Complain
    updateLostAndFound: builder.mutation<any, LostAndFoundRequestType>({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.ticketsUrl}/${ref_id}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => [
        { type: 'LostAndFounds', id: ref_id },
        { type: 'Attachments', id: 'LIST' },
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Lost&Found Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a complain lost and found.');
        }
      },
      transformResponse: (response) => {
        return response as any;
      },
    }),

    // Get List of Lost and Found Resolutions
    getLostAndFoundResolutionsList: builder.query<
      PaginatedResponseType<ResolutionType>,
      { page: number; ref_id: string }
    >({
      query: ({ page = 1, ref_id }) =>
        `${apiPaths.ticketsUrl}/${ref_id}/resolutions?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ id }) => ({ type: 'LostAndFoundsResolutions', id } as const)
              ),
              { type: 'LostAndFoundsResolutions', id: 'LIST' },
            ]
          : [{ type: 'LostAndFoundsResolutions', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Add new lost and found Resolution
    addLostAndFoundResolution: builder.mutation<
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
          { type: 'LostAndFounds', ref_id },
          { type: 'LostAndFoundsResolutions', id: 'LIST' },
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
    // Get All list of Sources
    getAllProducts: builder.query<ProductDetailType[], string>({
      query: (searchValue = '') =>
        `${apiPaths.productsUrl}/all?search=${searchValue}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ slug }) => ({ type: 'Products', slug } as const)
              ),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
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

export default lostandfoundApi;
