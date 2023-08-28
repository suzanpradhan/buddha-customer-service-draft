import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';

export const ticketDetailSchema = z.object({
  id: z.string(),
  created_on: z.date().optional(),
  modified_on: z.date().optional(),
  ref_id: z.string(),
  description: z.string(),
  kind: z.enum(['report', 'complain', 'lost', 'found']),
  title: z.string().pipe(nonempty),
  slug: z.string().optional(),
  number: z.string().pipe(nonempty),
});

export const remarksSchema = z.object({
  title: z.string().optional(),
  ref_id: z.string().optional(),
});

export const resolutionSchema = z.object({
  id: z.number().optional(),
  ref_id: z.string().optional(),
  title: z.string().optional(),
  user: z.number().optional(),
  status: z.number().optional(),
});

export const resolutionFormSchema = z.object({
  id: z.number().optional(),
  ref_id: z.string().optional(),
  title: z.string().optional(),
  user: z.number().optional(),
  status: z.string().optional(),
});

export const updateTicketStatusSchema = z.object({
  ref_id: z.string(),
  status: z.string(),
});

export type UpdateTicketStatusType = z.infer<typeof updateTicketStatusSchema>;

export type TicketDetailType = z.infer<typeof ticketDetailSchema>;

export type ResolutionType = z.infer<typeof resolutionSchema>;

export type ResolutionFormType = z.infer<typeof resolutionFormSchema>;
