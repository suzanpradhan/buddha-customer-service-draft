import { z } from 'zod';

export const attachmentSchema = z.object({
  id: z.number(),
  file: z.string(),
  file_type: z.string(),
});

export type AttachmentType = z.infer<typeof attachmentSchema>;

export interface AttachmentFormType {
  ref_id: string;
  files?: File[];
}
