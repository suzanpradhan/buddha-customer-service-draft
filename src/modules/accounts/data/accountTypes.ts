import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';

// export interface AccountDetailType {
//   id?: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   username: string;
//   is_staff: boolean;
//   password?: string;
//   avatar?: string;
// }

export const accountDetailSchema2 = z.object({
  id: z.number().or(z.string()).optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().pipe(nonempty),
  username: z.string(),
  is_staff: z.boolean(),
  password: z.string().optional(),
  avatar: z.string().optional(),
  phone: z.string().optional(),
});

export const profileDetailSchema = z.object({
  id: z.number().optional(),
  full_name: z.string(),
  mobile: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
  is_staff: z.boolean().optional(),
});

export const accountDetailSchema = z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  username: z.string().optional(),
  is_staff: z.boolean().optional(),
  password: z.string().optional(),
  profile: profileDetailSchema.optional(),
});

export type AccountDetailType = z.infer<typeof accountDetailSchema>;

export type AccountDetailTypeV2 = z.infer<typeof accountDetailSchema2>;

export type ProfileDetailType = z.infer<typeof profileDetailSchema>;
