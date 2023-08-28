import { selectorDataSchema } from '@/core/types/selectorTypes';
import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';

export const statusDetailSchema = z.object({
  id: z.number().optional(),
  title: z.string().pipe(nonempty),
  slug: z.string().optional(),
  kind: z.string().pipe(nonempty),
});

export const statusFormSchema = statusDetailSchema.extend({
  kind: z.array(selectorDataSchema).optional(),
});

export const statusRequestSchema = z.object({
  title: z.string(),
  kinds: z.array(z.string()),
});

export type StatusRequestSchema = z.infer<typeof statusRequestSchema>;

export type StatusDetailType = z.infer<typeof statusDetailSchema>;

export type StatusFormType = z.infer<typeof statusFormSchema>;
