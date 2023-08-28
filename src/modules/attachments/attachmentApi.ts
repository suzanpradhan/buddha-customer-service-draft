import { apiPaths } from '@/core/api/apiConstants';
import { baseApi } from '@/core/api/apiQuery';
import { toast } from 'react-toastify';
import { AttachmentFormType, AttachmentType } from './attachmentTypes';

const attachmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get List of Ticket Attachments
    getAttachmentList: builder.query<AttachmentType[], { ref_id: string }>({
      query: ({ ref_id }) => `${apiPaths.ticketsUrl}/${ref_id}/media/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Attachments', id } as const)),
              { type: 'Attachments', id: 'LIST' },
            ]
          : [{ type: 'Attachments', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Upload Ticket Attachments
    uploadAttachments: builder.mutation<any, AttachmentFormType>({
      query: ({ ref_id, ...payload }) => {
        var formData = new FormData();
        Array.from(payload.files ?? []).forEach((file) => {
          formData.append('files', file);
        });
        return {
          url: `${apiPaths.ticketsUrl}/${ref_id}/media/`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: [{ type: 'Attachments', id: 'LIST' }],
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Attachments Uploaded.');
        } catch (err) {
          console.log(err);
          toast.error('Failed uploading attachments.');
        }
      },
      transformResponse: (response) => {
        return response as AttachmentType[];
      },
    }),

    // Delete Ticket Attachment
    deleteAttachment: builder.mutation<void, { id: number }>({
      query({ id }) {
        return {
          url: `${apiPaths.ticketsUrl}/media/${id}`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Attachment Deleted.');
        } catch (err) {
          console.log(err);
          toast.error('Failed deleting a attachment.');
        }
      },
      invalidatesTags: (result, error, { id }) => {
        return [{ type: 'Attachments', id: id }];
      },
    }),
  }),
  overrideExisting: true,
});

export default attachmentApi;
