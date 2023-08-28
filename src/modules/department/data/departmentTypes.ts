import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';

export const departmentDetailSchema = z.object({
  name: z.string().pipe(nonempty),
  slug: z.string().optional(),
});

export type DepartmentDetailType = z.infer<typeof departmentDetailSchema>;
