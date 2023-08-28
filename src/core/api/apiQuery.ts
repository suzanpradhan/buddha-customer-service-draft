import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query';
import { apiPaths, setHeaders } from './apiConstants';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiPaths.baseUrl}`,
    prepareHeaders: async (headers) => await setHeaders(headers),
  }),
  tagTypes: [
    'Complains',
    'ComplainRemarks',
    'ComplainResolutions',
    'Attachments',
    'LostAndFounds',
    'LostAndFoundsRemarks',
    'LostAndFoundsResolutions',
    'Products',
    'Repairs',
    'RepairCompensations',
    'RepairsResolutions',
    'Reports',
    'Remarks',
    'Resolutions',
    'Roles',
    'Permissions',
    'UserPermissions',
    'ContentTypes',
    'Users',
    'Departments',
    'Flights',
    'Investigations',
    'Severities',
    'Sources',
    'SpotChecks',
    'SpotChecksAttributes',
    'SpotChecksRatings',
    'SpotChecksEvaluations',
    'Stations',
    'Status',
    'Surveys',
    'SurveyParticipants',
    'SurveyFeedbacks',
    'SurveyQuestionnaires',
    'SurveyQuestions',
    'Profiles',
    'SurveyUserQuestionResponses',
  ],
  endpoints: () => ({}),
});

export const baseClientApi = createApi({
  reducerPath: 'baseClientApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiPaths.baseUrl}`,
  }),
  tagTypes: [
    'ClientSurveyParticipant',
    'ClientSurveyQuestionnaires',
    'ClientSurvey',
  ],
  endpoints: () => ({}),
});
