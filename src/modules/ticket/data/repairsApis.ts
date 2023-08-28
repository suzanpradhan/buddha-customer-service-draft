import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import {
  CompensationDetailType,
  CompensationFormType,
  RepairDetailType,
  RepairFormType,
  UpdateRepairStatusType,
} from './repairsTypes';
import { ResolutionType } from './ticketTypes';

const repairsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Repairs
    getRepairs: builder.query<PaginatedResponseType<RepairDetailType>, number>({
      query: (page = 1) =>
        `${apiPaths.repairsUrl}/?kind__in=repair&page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                (repair) =>
                  ({ type: 'Repairs', id: repair.ticket.ref_id } as const)
              ),
              { type: 'Repairs', id: 'LIST' },
            ]
          : [{ type: 'Repairs', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Repair
    getRepair: builder.query<RepairDetailType, string>({
      query: (ref_id) => `${apiPaths.repairsUrl}/${ref_id}/`,
      providesTags: (result, error, ref_id) => {
        return [{ type: 'Repairs', id: ref_id }];
      },
    }),

    // Delete Repair
    deleteRepair: builder.mutation<void, string>({
      query(ref_id) {
        return {
          url: `${apiPaths.repairsUrl}/${ref_id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Baggage repair deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a baggage repair.');
        }
      },
      invalidatesTags: (result, error, ref_id) => [
        { type: 'Repairs', id: 'LIST' },
      ],
    }),

    // Get Repair Compensation
    getRepairCompensation: builder.query<CompensationDetailType, string>({
      query: (ref_id) => `${apiPaths.repairsUrl}/${ref_id}/compensation/get/`,
      providesTags: (result, error, ref_id) => {
        return [
          { type: 'RepairCompensations', id: ref_id },
          { type: 'RepairCompensations', id: 'LIST' },
        ];
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Add new Repair
    addRepair: builder.mutation<RepairDetailType, RepairFormType>({
      query: (payload) => ({
        url: `${apiPaths.repairsUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: [{ type: 'Repairs', id: 'LIST' }],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Baggage repair ticket created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a baggage repair ticket.');
        }
      },
      transformResponse: (response) => {
        return response as RepairDetailType;
      },
    }),

    // Update Report
    updateRepair: builder.mutation<RepairDetailType, RepairFormType>({
      query: (payload) => ({
        url: `${apiPaths.repairsUrl}/${payload.ticket.ref_id}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ticket }) => [
        { type: 'Repairs', id: ticket.ref_id },
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Baggage repair ticket updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a baggage repair ticket.');
        }
      },
      transformResponse: (response) => {
        return response as RepairDetailType;
      },
    }),

    // Add Repair Compensation
    addRepairCompensation: builder.mutation<
      CompensationDetailType,
      CompensationFormType
    >({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.repairsUrl}/${ref_id}/compensation/create/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => {
        return [{ type: 'RepairCompensations', id: ref_id }];
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Repair compensation added.');
        } catch (err) {
          console.log(err);
          toast.error('Failed adding repair compensation.');
        }
      },
      transformResponse: (response) => {
        return response as any;
      },
    }),

    // Get List of Reports Resolutions
    getReportsResolutionsList: builder.query<
      PaginatedResponseType<ResolutionType>,
      { page: number; ref_id: string }
    >({
      query: ({ page = 1, ref_id }) =>
        `${apiPaths.ticketsUrl}/${ref_id}/resolutions/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ id }) => ({ type: 'RepairsResolutions', id } as const)
              ),
              { type: 'RepairsResolutions', id: 'LIST' },
            ]
          : [{ type: 'RepairsResolutions', id: 'LIST' }],
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
          { type: 'Repairs', id: ref_id },
          { type: 'RepairsResolutions', id: 'LIST' },
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
        return [{ type: 'RepairsResolutions', id: id }];
      },
    }),

    // Update Repair Status
    updateRepairStatus: builder.mutation<
      RepairDetailType,
      Partial<UpdateRepairStatusType>
    >({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.repairsUrl}/${ref_id}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => [
        { type: 'Repairs', id: ref_id },
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Repair report status updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating repair report.');
        }
      },
      transformResponse: (response) => {
        return response as RepairDetailType;
      },
    }),
  }),
  overrideExisting: true,
});

export default repairsApi;
