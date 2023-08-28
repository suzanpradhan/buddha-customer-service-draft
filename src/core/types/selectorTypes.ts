import { z } from 'zod';

export const selectorDataSchema = z.object({
  value: z.string(),
  label: z.string(),
  extra: z.string().optional(),
  __isNew__: z.boolean().optional(),
});

export type SelectorDataType = z.infer<typeof selectorDataSchema>;
