import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';

export const permissionSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  codename: z.string().optional(),
});

export const contentKindSchema = z.object({
  id: z.number(),
  model: z.string(),
  permissions: z.array(permissionSchema),
});

export const roleSchema = z.object({
  selectAll: z.boolean().optional(),
  id: z.number().or(z.string()).optional(),
  name: z.string().pipe(nonempty),
  permissions: z.array(z.string()).optional(),
});

export const roleFormSchema = roleSchema.extend({
  username: z.string().optional(),
});

export type RoleType = z.infer<typeof roleSchema>;
export type RoleFormType = z.infer<typeof roleFormSchema>;
export type PermissionType = z.infer<typeof permissionSchema>;
export type ContentKindType = z.infer<typeof contentKindSchema>;
