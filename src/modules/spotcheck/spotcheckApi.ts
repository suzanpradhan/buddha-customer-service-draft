import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import {
  SpotCheckAttributeType,
  SpotCheckDetailType,
  SpotCheckEvaluationFormType,
  SpotCheckEvaluationType,
  SpotCheckFormType,
  SpotCheckRatingFormType,
  SpotCheckRatingType,
} from './spotcheckTypes';

const spotCheckApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Paginated List of SpotChecks
    getPaginatedSpotChecksList: builder.query<
      PaginatedResponseType<SpotCheckDetailType>,
      number
    >({
      query: (page = 1) => `${apiPaths.spotcheckUrl}/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ ref_id }) => ({ type: 'SpotChecks', ref_id } as const)
              ),
              { type: 'SpotChecks', id: 'LIST' },
            ]
          : [{ type: 'SpotChecks', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each SpotCheck
    getSpotCheck: builder.query<SpotCheckDetailType, string>({
      query: (ref_id) => `${apiPaths.spotcheckUrl}/${ref_id}/`,
      providesTags: (result, error, ref_id) => {
        return [{ type: 'SpotChecks', ref_id }];
      },
    }),

    // Add new Spot Check
    addSpotCheck: builder.mutation<SpotCheckDetailType, SpotCheckFormType>({
      query: (payload) => ({
        url: `${apiPaths.spotcheckUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Spot Check Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a spot check.');
        }
      },
      invalidatesTags: (result, error, { ref_id }) => [
        { type: 'SpotChecks', id: ref_id },
      ],
      transformResponse: (response) => {
        return response as SpotCheckDetailType;
      },
    }),

    // Delete Spot Check
    deleteSpotCheck: builder.mutation<void, string>({
      query(ref_id) {
        return {
          url: `${apiPaths.spotcheckUrl}/${ref_id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Spot check deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a spot check.');
        }
      },
      invalidatesTags: (result, error, ref_id) => [
        { type: 'SpotChecks', id: 'LIST' },
      ],
    }),

    // Update each Spot Check
    updateSpotCheck: builder.mutation<
      SpotCheckDetailType,
      Partial<SpotCheckFormType>
    >({
      query: ({ ref_id, ...payload }) => ({
        url: `${apiPaths.spotcheckUrl}/${ref_id}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      invalidatesTags: (result, error, { ref_id }) => [
        { type: 'SpotChecks', ref_id },
      ],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Spot Check Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a spot check.');
        }
      },
      transformResponse: (response) => {
        return response as SpotCheckDetailType;
      },
    }),

    // Get List of SpotChecks Attributes
    getSpotChecksAttributeList: builder.query<SpotCheckAttributeType[], void>({
      query: () => `${apiPaths.spotchecksAttributesUrl}/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ id }) => ({ type: 'SpotChecksAttributes', id } as const)
              ),
              { type: 'SpotChecksAttributes', id: 'LIST' },
            ]
          : [{ type: 'SpotChecksAttributes', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get Paginated List of Staff Rating
    getPaginatedStaffRatingList: builder.query<
      PaginatedResponseType<SpotCheckRatingType>,
      { page: number; ref_id: string }
    >({
      query: ({ page = 1, ref_id }) =>
        `${apiPaths.spotCheckRatingUrl}/?spot_check__ref_id=${ref_id}&page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ id }) => ({ type: 'SpotChecksRatings', id } as const)
              ),
              { type: 'SpotChecksRatings', id: 'LIST' },
            ]
          : [{ type: 'SpotChecksRatings', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Add new Spot Check Staff Rating
    addSpotCheckStaffRating: builder.mutation<
      SpotCheckRatingType,
      SpotCheckRatingFormType
    >({
      query: (payload) => ({
        url: `${apiPaths.spotCheckRatingUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Spot Check Rating Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a spot check rating.');
        }
      },
      invalidatesTags: [{ type: 'SpotChecksRatings', id: 'LIST' }],
      transformResponse: (response) => {
        return response as SpotCheckRatingType;
      },
    }),

    // Get List of Spot Check Evaluations
    getSpotCheckEvaluationsList: builder.query<
      SpotCheckEvaluationType[],
      { ref_id: string }
    >({
      query: ({ ref_id }) =>
        `${apiPaths.spotCheckEvaluationUrl}/?spot_check__ref_id=${ref_id}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ id }) => ({ type: 'SpotChecksEvaluations', id } as const)
              ),
              { type: 'SpotChecksEvaluations', id: 'LIST' },
            ]
          : [{ type: 'SpotChecksEvaluations', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Add new Spot Check Evaluation
    addSpotCheckEvaluation: builder.mutation<
      SpotCheckEvaluationType,
      SpotCheckEvaluationFormType
    >({
      query: (payload) => ({
        url: `${apiPaths.spotCheckEvaluationUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Spot Check Evaluation Added.');
        } catch (err) {
          console.log(err);
          toast.error('Failed adding a spot check evaluation.');
        }
      },
      invalidatesTags: [{ type: 'SpotChecksEvaluations', id: 'LIST' }],
      transformResponse: (response) => {
        return response as SpotCheckEvaluationType;
      },
    }),
  }),
  overrideExisting: true,
});

export default spotCheckApi;
