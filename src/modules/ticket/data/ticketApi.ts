import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import {
  RemarksType,
  ReportDetailType,
  ReportFormType,
  ReportRequestType,
} from '@/modules/reports/data/reportTypes';
import { toast } from 'react-toastify';
import { ResolutionType, UpdateTicketStatusType } from './ticketTypes';

const ticketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Reports
    getReports: builder.query<PaginatedResponseType<ReportDetailType>, number>({
      query: (page = 1) =>
        `${apiPaths.ticketsUrl}/?kind__in=report&page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ id }) => ({ type: 'Reports', id } as const)
              ),
              { type: 'Reports', id: 'LIST' },
            ]
          : [{ type: 'Reports', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Report
    getReport: builder.query<ReportFormType, string>({
      query: (ref_id) => `${apiPaths.ticketsUrl}/${ref_id}/?kind__in=report`,
      providesTags: (result, error, ref_id) => {
        return [{ type: 'Reports', ref_id }];
      },
    }),

    // Delete Report
    deleteReport: builder.mutation<void, string>({
      query(ref_id) {
        return {
          url: `${apiPaths.ticketsUrl}/${ref_id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Report Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a report.');
        }
      },
      invalidatesTags: (result, error, ref_id) => [
        { type: 'Reports', id: 'LIST' },
      ],
    }),

    // Get Ticket Remarks
    getRemarks: builder.query<RemarksType, string>({
      query: (ref_id) => `${apiPaths.ticketsUrl}/${ref_id}/remarks`,
      providesTags: (result, error, ref_id) => {
        return [
          { type: 'Remarks', id: ref_id },
          { type: 'Remarks', id: 'LIST' },
        ];
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Add Ticket Remarks
    addRemarks: builder.mutation<any, RemarksType>({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.ticketsUrl}/${ref_id}/remarks/update/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => {
        return [{ type: 'Remarks', id: ref_id }];
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Remarks Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a remarks.');
        }
      },
      transformResponse: (response) => {
        return response as any;
      },
    }),

    // Update Report Status
    updateReportStatus: builder.mutation<
      ReportFormType,
      Partial<UpdateTicketStatusType>
    >({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.ticketsUrl}/${ref_id}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => [
        { type: 'Reports', ref_id },
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          console.log(payload);

          await queryFulfilled;
          toast.success('Ticket Status Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating ticket status.');
        }
      },
      transformResponse: (response) => {
        return response as ReportFormType;
      },
    }),

    // Delete Ticket Remarks
    deleteRemarks: builder.mutation<void, RemarksType>({
      query({ ref_id, ...payload }) {
        return {
          url: `${apiPaths.ticketsUrl}/${ref_id}/remarks/delete/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Remarks Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a remarks.');
        }
      },
      invalidatesTags: (result, error, { ref_id }) => {
        console.log('invalidatesTags' + ref_id?.toString());

        return [
          { type: 'Remarks', id: ref_id },
          { type: 'Remarks', id: 'LIST' },
        ];
      },
    }),

    // Add new Report
    addReport: builder.mutation<any, ReportRequestType>({
      query: (payload) => ({
        url: `${apiPaths.ticketsUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: [{ type: 'Reports', id: 'LIST' }, 'Attachments'],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Report Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a report.');
        }
      },
      transformResponse: (response) => {
        return response as any;
      },
    }),

    // Update Report
    updateReport: builder.mutation<any, ReportRequestType>({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.ticketsUrl}/${ref_id}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => [
        { type: 'Reports', id: ref_id },
        'Attachments',
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Report Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a report.');
        }
      },
      transformResponse: (response) => {
        return response as any;
      },
    }),

    // Get List of Resolutions
    getResolutionsList: builder.query<
      PaginatedResponseType<ResolutionType>,
      { page: number; ref_id: string }
    >({
      query: ({ page = 1, ref_id }) =>
        `${apiPaths.ticketsUrl}/${ref_id}/resolutions/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ id }) => ({ type: 'Resolutions', id } as const)
              ),
              { type: 'Resolutions', id: 'LIST' },
            ]
          : [{ type: 'Resolutions', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Add new Resolution
    addResolution: builder.mutation<ResolutionType, ResolutionType | any>({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.ticketsUrl}/${ref_id}/resolutions/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => {
        return [
          { type: 'Reports', ref_id },
          { type: 'Resolutions', id: 'LIST' },
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

    // Delete Ticket Resolution
    deleteResolutions: builder.mutation<void, ResolutionType>({
      query({ id, ...payload }) {
        return {
          url: `${apiPaths.ticketsUrl}/resolutions/${id}`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Resolution Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a resolution.');
        }
      },
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: 'Resolutions', id: id },
          { type: 'Resolutions', id: 'LIST' },
        ];
      },
    }),
  }),
  overrideExisting: true,
});

export default ticketApi;
