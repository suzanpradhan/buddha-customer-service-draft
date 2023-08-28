import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';

export const investigationDetailSchema = z.object({
  id: z.number().optional(),
  title: z.string().pipe(nonempty),
  findings: z.string().optional(),
  ref_id: z.string().optional(),
  cause: z.string().optional(),
  recommendation: z.string().optional(),
  created_on: z.date().optional(),
});

export type InvestigationDetailType = z.infer<typeof investigationDetailSchema>;
