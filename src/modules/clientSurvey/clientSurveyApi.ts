import { apiPaths } from '@/core/api/apiConstants';
import { baseClientApi } from '@/core/api/apiQuery';
import { toast } from 'react-toastify';
import { QuestionnairesDetailType } from '../survey/surveyTypes';
import {
  ClientQuestionnaireAttemptFormType,
  ClientSurveyFeedbackRequestType,
  ClientSurveyParticipantType,
} from './clientSurveyTypes';

const clientSurveyApi = baseClientApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Survey Participant
    getSurveyParticipant: builder.query<ClientSurveyParticipantType, string>({
      query: (id) => `${apiPaths.participantsUrl}/${id}/`,
      providesTags: (result, error, id) => {
        return ['ClientSurveyParticipant'];
      },
    }),

    // Submit Survey Feedback
    submitSurveyFeedback: builder.mutation<
      object,
      ClientSurveyFeedbackRequestType
    >({
      query: (payload) => ({
        url: `${apiPaths.feedbacksUrl}/bulk/`,
        method: 'POST',
        body: payload,
      }),
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Your Feedback has been recorded.');
        } catch (err) {
          console.log(err);
          toast.error('Failed to submit your feedbacks.');
        }
      },
      invalidatesTags: ['ClientSurveyParticipant'],
    }),

    // Get each Questionnaire
    getQuestionnaire: builder.query<QuestionnairesDetailType, string>({
      query: (ref_id) => `${apiPaths.questionnairesUrl}/${ref_id}/`,
      providesTags: (result, error, ref_id) => {
        return [{ type: 'ClientSurveyQuestionnaires', id: ref_id }];
      },
      transformResponse: (response) => {
        return response as QuestionnairesDetailType;
      },
    }),

    // Submit Survey
    submitSurvey: builder.mutation<object, ClientQuestionnaireAttemptFormType>({
      query: (payload) => ({
        url: `${apiPaths.questionnaireAttemptUrl}/`,
        method: 'POST',
        body: payload,
      }),
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Your survey has been recorded.');
        } catch (err) {
          console.log(err);
          toast.error('Failed to submit your survey.');
        }
      },
      invalidatesTags: ['ClientSurvey', 'ClientSurveyParticipant'],
    }),
  }),
  overrideExisting: true,
});

export default clientSurveyApi;
