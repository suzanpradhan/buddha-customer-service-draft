import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import {
  QuestionnairesDetailType,
  QuestionnairesFormType,
  SurveyDetailType,
  SurveyMultipleParticipantType,
  SurveyParticipantCreateFormType,
  SurveyParticipantsType,
  SurveyQuestionnaireAttemptDetailType,
} from './surveyTypes';

const surveyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Paginated List of Surveys
    getPaginatedSurveysList: builder.query<
      PaginatedResponseType<SurveyDetailType>,
      number
    >({
      query: (page = 1) => `${apiPaths.surveysUrl}/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ ref_id }) => ({ type: 'Surveys', ref_id } as const)
              ),
              { type: 'Surveys', id: 'LIST' },
            ]
          : [{ type: 'Surveys', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Survey
    getSurvey: builder.query<SurveyDetailType, string>({
      query: (ref_id) => `${apiPaths.surveysUrl}/${ref_id}/`,
      providesTags: (result, error, ref_id) => {
        return [{ type: 'Surveys', id: ref_id }];
      },
    }),

    // Add new Survey
    addSurvey: builder.mutation<SurveyDetailType, SurveyDetailType>({
      query: (payload) => ({
        url: `${apiPaths.surveysUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Survey Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a survey.');
        }
      },
      invalidatesTags: (result, error, { ref_id }) => [
        { type: 'Surveys', id: ref_id },
      ],
      transformResponse: (response) => {
        return response as SurveyDetailType;
      },
    }),

    // Update each Survey
    updateSurvey: builder.mutation<SurveyDetailType, Partial<SurveyDetailType>>(
      {
        query: ({ ref_id, ...payload }) => ({
          url: `${apiPaths.surveysUrl}/${ref_id}/`,
          method: 'PATCH',
          body: payload,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        }),
        invalidatesTags: (result, error, { ref_id }) => [
          { type: 'Surveys', id: ref_id },
        ],
        async onQueryStarted(payload, { queryFulfilled }) {
          try {
            await queryFulfilled;
            toast.success('Survey Updated.');
          } catch (err) {
            console.log(err);
            toast.error('Failed updating a survey.');
          }
        },
        transformResponse: (response) => {
          return response as SurveyDetailType;
        },
      }
    ),

    // Get Paginated List of participants
    getSurveyParticipants: builder.query<
      PaginatedResponseType<SurveyParticipantsType>,
      { page?: number; surveyRefId: string }
    >({
      query: ({
        page = 1,
        surveyRefId,
      }: {
        page?: number;
        surveyRefId: string;
      }) =>
        `${apiPaths.participantsUrl}/?survey__ref_id=${surveyRefId}&page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ id }) => ({ type: 'SurveyParticipants', id } as const)
              ),
              { type: 'SurveyParticipants', id: 'LIST' },
            ]
          : [{ type: 'SurveyParticipants', id: 'LIST' }],
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        const { surveyRefId } = queryArgs;
        return endpointName + ':' + surveyRefId;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Survey Participant
    getSurveyParticipant: builder.query<SurveyParticipantsType, string>({
      query: (id) => `${apiPaths.participantsUrl}/${id}/`,
      providesTags: (result, error, id) => {
        return [{ type: 'SurveyParticipants', id }];
      },
    }),

    // Add new Survey Participant
    addSurveyParticipant: builder.mutation<
      SurveyParticipantsType,
      SurveyParticipantCreateFormType
    >({
      query: (payload) => {
        return {
          url: `${apiPaths.participantsUrl}/`,
          method: 'POST',
          body: {
            survey: payload.survey,
            station: payload.station,
            flight: payload.flight,
            profile: {
              ...payload,
            },
          },
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Survey Participant Created.');
        } catch (err) {
          console.log(err);
          toast.error('Failed creating a survey participant.');
        }
      },
      invalidatesTags: (result, error) => [
        { type: 'SurveyParticipants', id: 'LIST' },
      ],
      transformResponse: (response) => {
        return response as SurveyParticipantsType;
      },
    }),

    // Update Survey Participant
    updateSurveyParticipant: builder.mutation<
      SurveyParticipantsType,
      SurveyParticipantCreateFormType
    >({
      query: ({ id, ...payload }) => {
        return {
          url: `${apiPaths.participantsUrl}/${id}/`,
          method: 'PATCH',
          body: {
            survey: payload.survey,
            station: payload.station,
            flight: payload.flight,
            profile: {
              ...payload,
            },
          },
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Survey Participant Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating a survey participant.');
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'SurveyParticipants', id },
      ],
      transformResponse: (response) => {
        return response as SurveyParticipantsType;
      },
    }),

    // Add bulk Survey Participants
    addBulkSurveyParticipants: builder.mutation<
      any,
      SurveyMultipleParticipantType
    >({
      query: (payload) => {
        return {
          url: `${apiPaths.addBulkParticipantsUrl}/`,
          method: 'POST',
          body: payload,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Participants Added.');
        } catch (err) {
          console.log(err);
          toast.error('Failed adding a survey participant.');
        }
      },
      invalidatesTags: (result, error) => [
        { type: 'SurveyParticipants', id: 'LIST' },
      ],
      transformResponse: (response) => {
        return response;
      },
    }),

    // Delete Survey Participant
    deleteSurveyParticipant: builder.mutation<void, string>({
      query(id) {
        return {
          url: `${apiPaths.participantsUrl}/${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Survey Participant Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a survey participant.');
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: 'SurveyParticipants', id },
      ],
    }),

    // Get All List of Survey User Feedbacks
    getSurveyUserFeedbacks: builder.query<
      SurveyParticipantsType[],
      { surveyUserId: string }
    >({
      query: ({ surveyUserId }: { surveyUserId: string }) =>
        `${apiPaths.feedbacksUrl}/?survey_respond__id=${surveyUserId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ id }) => ({ type: 'SurveyFeedbacks', id } as const)
              ),
              { type: 'SurveyFeedbacks', id: 'LIST' },
            ]
          : [{ type: 'SurveyFeedbacks', id: 'LIST' }],
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        const { surveyUserId } = queryArgs;
        return endpointName + ':' + surveyUserId;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get All List of Survey User Question Responses
    getSurveyUserQuestionResponses: builder.query<
      SurveyQuestionnaireAttemptDetailType,
      { surveyUserId: string }
    >({
      query: ({ surveyUserId }: { surveyUserId: string }) =>
        `${apiPaths.questionnaireAttemptUrl}/${surveyUserId}/`,
      providesTags: (result, error, { surveyUserId }) => {
        return [{ type: 'SurveyUserQuestionResponses', surveyUserId }];
      },
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        const { surveyUserId } = queryArgs;
        return endpointName + ':' + surveyUserId;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Questionnaire
    getQuestionnaire: builder.query<QuestionnairesDetailType, string>({
      query: (ref_id) => `${apiPaths.questionnairesUrl}/${ref_id}/`,
      providesTags: (result, error, ref_id) => {
        return [{ type: 'SurveyQuestionnaires', id: ref_id }];
      },
      transformResponse: (response) => {
        return response as QuestionnairesDetailType;
      },
    }),

    // Create Questionnaires
    createQuestionnaires: builder.mutation<
      QuestionnairesDetailType,
      QuestionnairesFormType
    >({
      query: (payload) => {
        return {
          url: `${apiPaths.questionnairesUrl}/`,
          method: 'POST',
          body: payload,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Questionnaires Added.');
        } catch (err) {
          console.log(err);
          toast.error('Failed adding questionnaires.');
        }
      },
      invalidatesTags: (result, error, { survey }) => [
        { type: 'SurveyQuestionnaires', id: survey },
      ],
      transformResponse: (response) => {
        return response as QuestionnairesDetailType;
      },
    }),

    // Update Questionnaires
    updateQuestionnaires: builder.mutation<
      QuestionnairesDetailType,
      QuestionnairesFormType
    >({
      query: (payload) => {
        return {
          url: `${apiPaths.questionnairesUrl}/${payload.survey}/`,
          method: 'PATCH',
          body: payload,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Questionnaires Updated.');
        } catch (err) {
          console.log(err);
          toast.error('Failed updating questionnaires.');
        }
      },
      invalidatesTags: (result, error, { survey }) => [
        { type: 'SurveyQuestionnaires', id: survey },
      ],
      transformResponse: (response) => {
        return response as QuestionnairesDetailType;
      },
    }),

    deleteQuestion: builder.mutation<void, string>({
      query(id) {
        return {
          url: `${apiPaths.questionsUrl}/${id}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Question Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a question.');
        }
      },
      invalidatesTags: ['SurveyQuestionnaires'],
    }),
  }),
  overrideExisting: true,
});

export default surveyApi;
