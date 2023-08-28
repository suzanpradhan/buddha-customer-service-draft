import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import { FlightDetailType } from './flightTypes';

const flightApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Flights
    getFlights: builder.query<PaginatedResponseType<FlightDetailType>, number>({
      query: (page = 1) => `${apiPaths.flightsUrl}/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ slug }) => ({ type: 'Flights', slug } as const)
              ),
              { type: 'Flights', id: 'LIST' },
            ]
          : [{ type: 'Flights', id: 'LIST' }],
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

    // Get All list of Flights
    getAllFlights: builder.query<FlightDetailType[], string>({
      query: (searchValue = '') =>
        `${apiPaths.flightsUrl}/all?search=${searchValue}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ slug }) => ({ type: 'Flights', slug } as const)),
              { type: 'Flights', id: 'LIST' },
            ]
          : [{ type: 'Flights', id: 'LIST' }],
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

    // Get each Flight
    getFlight: builder.query<FlightDetailType, string>({
      query: (slug) => `${apiPaths.flightsUrl}/${slug}`,
      providesTags: (result, error, slug) => {
        return [{ type: 'Flights', slug }];
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
          toast.error(JSON.stringify(err));
        }
      },
    }),

    // Add new Flight
    addFlight: builder.mutation<FlightDetailType, FlightDetailType | any>({
      query: (payload) => ({
        url: `${apiPaths.flightsUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: [{ type: 'Flights', id: 'LIST' }],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Flight Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a flight.');
        }
      },
      transformResponse: (response) => {
        return response as FlightDetailType;
      },
    }),
    // Update each Flights
    updateFlight: builder.mutation<FlightDetailType, Partial<FlightDetailType>>(
      {
        query: ({ slug, ...payload }) => ({
          url: `${apiPaths.flightsUrl}/${slug}/`,
          method: 'PATCH',
          body: payload,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        }),
        invalidatesTags: (result, error, { slug }) => [
          { type: 'Flights', slug },
        ],
        async onQueryStarted(payload, { queryFulfilled }) {
          try {
            await queryFulfilled;
            toast.success('Flight Updated.');
          } catch (err) {
            console.log(err);
            toast.error('Failed updating a flight.');
          }
        },
        transformResponse: (response) => {
          return response as FlightDetailType;
        },
      }
    ),
    // Delete each Flight
    deleteFlight: builder.mutation<void, FlightDetailType>({
      query({ slug, ...payload }) {
        return {
          url: `${apiPaths.flightsUrl}/${slug}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Flight Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a flight.');
        }
      },
      invalidatesTags: (result, error, { slug }) => [{ type: 'Flights', slug }],
    }),
  }),
  overrideExisting: true,
});

export default flightApi;
