import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '../utils/authOptions';

export const apiConfig = {
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

export const getHeaders = async () => {
  const session = await getServerSession(authOptions);

  const token = (session as any)?.user.accessToken as string;
  if (token) {
    (apiConfig as any)['headers']['authorization'] = `Bearer ${token}`;
  }

  return apiConfig;
};

export async function setHeaders(headers: Headers) {
  const session = await getSession();
  if (session) {
    const token = (session! as any).user.accessToken as string;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
  }
  // headers.set('content-type', 'application/json');
  // headers.set('Access-Control-Allow-Origin', '*');
  return headers;
}

export async function setFormDataHeaders(headers: Headers) {
  const session = Promise.resolve(await getSession());
  if (session) {
    const token = (session! as any).user.accessToken as string;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
  }

  headers.set('Content-Type', 'multipart/form-data');
  console.log(headers);
  // headers.set('Access-Control-Allow-Origin', '*');
  return headers;
}

export const apiPaths = {
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL + '/api/v1',
  loginUrl: '/auth/login/',
  accountsUrl: '/accounts',
  profilesUrl: '/profiles',
  flightsUrl: '/flights',
  severitiesUrl: '/severities',
  stationsUrl: '/stations',
  statusUrl: '/status',
  departmentsUrl: '/departments',
  sourcesUrl: '/sources',
  productsUrl: '/products',
  ticketsUrl: '/tickets',
  rolesUrl: '/groups',
  userRoleUrl: '/user-permissions',
  permissionsUrl: '/permissions',
  contentKindsUrl: '/content-types',
  surveysUrl: '/surveys',
  participantsUrl: '/participants',
  addBulkParticipantsUrl: '/participants/bulk',
  feedbacksUrl: '/feedbacks',
  spotcheckUrl: '/spotchecks',
  spotchecksAttributesUrl: '/spotcheckattributes',
  spotCheckRatingUrl: '/spotcheckratings',
  spotCheckEvaluationUrl: '/spotcheckevaluations',
  repairsUrl: '/repairs',
  compensationUrl: '/compensations',
  questionnairesUrl: '/questionnaires',
  questionsUrl: '/questions',
  questionnaireAttemptUrl: '/questionnaire/attempt',
};
