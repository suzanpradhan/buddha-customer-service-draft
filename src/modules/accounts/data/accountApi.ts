import { apiPaths, setHeaders } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { toast } from 'react-toastify';
import { AccountDetailType, ProfileDetailType } from './accountTypes';

const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Accounts
    getAccounts: builder.query<
      PaginatedResponseType<AccountDetailType>,
      number
    >({
      query: (page = 1) => `${apiPaths.accountsUrl}/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ username }) => ({ type: 'Users', username } as const)
              ),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get List of Profiles
    getProfiles: builder.query<
      PaginatedResponseType<ProfileDetailType>,
      { page?: number; search?: string; surveyRefId?: string }
    >({
      query: ({ page = 1, search = '', surveyRefId }) =>
        `${apiPaths.profilesUrl}/?page=${page}&search=${search}${
          surveyRefId ? '&survey=' + surveyRefId : ''
        }`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(
                ({ id }) => ({ type: 'Profiles', id } as const)
              ),
              { type: 'Profiles', id: 'LIST' },
            ]
          : [{ type: 'Profiles', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get each Account
    getAccount: builder.query<AccountDetailType, string>({
      query: (username) => `${apiPaths.accountsUrl}/${username}`,
      providesTags: (result, error, username) => {
        return [{ type: 'Users', username }];
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

    // Add Account
    addAccount: builder.mutation<AccountDetailType, AccountDetailType>({
      query: (payload) => ({
        url: `${apiPaths.accountsUrl}/`,
        method: 'POST',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('User Account Created.');
        } catch (err) {
          console.log(err);

          toast.error('Failed creating an account.');
        }
      },
      invalidatesTags: (result, error, { username }) => [
        { type: 'Users', username },
      ],
    }),

    // Update Account
    updateAccount: builder.mutation<AccountDetailType, AccountDetailType>({
      query: ({ username, ...payload }) => ({
        url: `${apiPaths.accountsUrl}/${username}/`,
        method: 'PATCH',
        body: payload,
        prepareHeaders: async (headers: Headers) => await setHeaders(headers),
      }),
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('User Account Updated.');
        } catch (err) {
          console.log(err);

          toast.error('Failed updating an account.');
        }
      },
      invalidatesTags: (result, error, { username }) => [
        { type: 'Users', username },
      ],
    }),

    // Get All list of Users
    getAllUsers: builder.query<AccountDetailType[], void>({
      query: () => `${apiPaths.accountsUrl}/all`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ username }) => ({ type: 'Users', username } as const)
              ),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
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

    // Delete User
    deleteUser: builder.mutation<void, string>({
      query(username) {
        return {
          url: `${apiPaths.accountsUrl}/${username}/`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('User has been deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a user.');
        }
      },
      invalidatesTags: (result, error, username) => [
        { type: 'Users', username },
      ],
    }),
  }),
  overrideExisting: false,
});

export default accountApi;
