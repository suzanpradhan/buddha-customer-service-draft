import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';

export const sourceDetailSchema = z.object({
  id: z.number().optional(),
  name: z.string().pipe(nonempty),
  slug: z.string().optional(),
});

export type SourceDetailType = z.infer<typeof sourceDetailSchema>;
