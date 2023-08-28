import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';

export const getTestDataAPI = createApi({
  reducerPath: 'getTestDataAPI',
  baseQuery: fetchBaseQuery({
    // mode: 'no-cors',
    baseUrl: 'http://127.0.0.1:8000/api/v1/',
  }),
  endpoints: (builder) => ({
    get: builder.query<string[], void>({
      query: () => 'auth/test',
    }),
  }),
});
