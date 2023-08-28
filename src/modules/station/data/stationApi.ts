import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import { StationDetailType } from './stationTypes';

const stationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Stations
    getStations: builder.query<
      PaginatedResponseType<StationDetailType>,
      number
    >({
      query: (page) => `${apiPaths.stationsUrl}/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ slug }) => ({ type: 'Stations', slug } as const)
              ),
              { type: 'Stations', id: 'LIST' },
            ]
          : [{ type: 'Stations', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Station
    getStation: builder.query<StationDetailType, string>({
      query: (slug) => `${apiPaths.stationsUrl}/${slug}/`,
      providesTags: (result, error, slug) => {
        return [{ type: 'Stations', slug }];
      },
    }),

    // Get All list of Stations
    getAllStations: builder.query<StationDetailType[], string>({
      query: (searchValue = '') =>
        `${apiPaths.stationsUrl}/all?search=${searchValue}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ slug }) => ({ type: 'Stations', slug } as const)
              ),
              { type: 'Stations', id: 'LIST' },
            ]
          : [{ type: 'Stations', id: 'LIST' }],
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

    // Add new Station
    addStation: builder.mutation<StationDetailType, StationDetailType | any>({
      query: (payload) => ({
        url: `${apiPaths.stationsUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: [{ type: 'Stations', id: 'LIST' }],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Station Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a station.');
        }
      },
      transformResponse: (response) => {
        return response as StationDetailType;
      },
    }),

    // Update each Station
    updateStation: builder.mutation<
      StationDetailType,
      Partial<StationDetailType>
    >({
      query: ({ slug, ...payload }) => ({
        url: `${apiPaths.stationsUrl}/${slug}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Stations', slug },
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Station Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a station.');
        }
      },
      transformResponse: (response) => {
        return response as StationDetailType;
      },
    }),

    // Delete each Station
    deleteStation: builder.mutation<void, StationDetailType>({
      query({ slug, ...payload }) {
        return {
          url: `${apiPaths.stationsUrl}/${slug}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Station Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a station.');
        }
      },
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Stations', slug },
      ],
    }),
  }),
  overrideExisting: true,
});

export default stationApi;
