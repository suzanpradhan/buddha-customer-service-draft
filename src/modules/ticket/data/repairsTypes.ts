'use client';

import { nonempty } from '@/core/utils/formUtils';
import { accountDetailSchema } from '@/modules/accounts/data/accountTypes';
import { flightDetailSchema } from '@/modules/flights/data/flightTypes';
import { severityDetailSchema } from '@/modules/severities/data/severityTypes';
import { statusDetailSchema } from '@/modules/status/data/statusTypes';
import { z } from 'zod';

export const repairTicketDetailSchema = z.object({
  id: z.string(),
  ref_id: z.string(),
  title: z.string().pipe(nonempty),
  description: z.string().optional(),
  flight: flightDetailSchema.optional(),
  kind: z.string(),
  severity: severityDetailSchema,
  status: statusDetailSchema,
  owner: accountDetailSchema,
  witness: accountDetailSchema,
  created_on: z.date().or(z.string()).optional(),
  modified_on: z.date().or(z.string()).optional(),
});

export const compensationDetailSchema = z.object({
  id: z.string().optional(),
  signed_by: accountDetailSchema.optional(),
  amount: z.string().optional(),
  bill_no: z.string().optional(),
  created_on: z.date().or(z.string()).optional(),
  modified_on: z.date().or(z.string()).optional(),
});

export const repairDetailSchema = z.object({
  id: z.string().optional(),
  ticket: repairTicketDetailSchema,
  pir_form_no: z.string().optional(),
  received_date: z.date().or(z.string()).optional(),
  issued_date: z.date().or(z.string()).optional(),
  compensation: compensationDetailSchema.optional(),
});

export const compensationFormSchema = z.object({
  ref_id: z.string(),
  bill_no: z.string().optional(),
  signed_by: z.string().optional(),
  amount: z.number().optional(),
});

export const updateRepairStatusSchema = z.object({
  ref_id: z.string(),
  ticket: z.object({
    id: z.string(),
    status: z.string(),
  }),
});

export const repairTicketFormSchema = z.object({
  id: z.string().optional(),
  ref_id: z.string().optional(),
  title: z.string().pipe(nonempty),
  description: z.string().optional(),
  flight: z.string().optional(),
  kind: z.string(),
  severity: z.string().optional(),
  status: z.string().optional(),
  owner: z.string().optional(),
  witness: z.string().optional(),
  created_on: z.date().or(z.string()).optional(),
  modified_on: z.date().or(z.string()).optional(),
});

export const repairFormSchema = z.object({
  id: z.string().optional(),
  ticket: repairTicketFormSchema,
  pir_form_no: z.string().optional(),
  received_date: z.date().or(z.string()).optional(),
  issued_date: z.date().or(z.string()).optional(),
});

export type RepairTicketDetailType = z.infer<typeof repairTicketDetailSchema>;
export type CompensationDetailType = z.infer<typeof compensationDetailSchema>;
export type RepairDetailType = z.infer<typeof repairDetailSchema>;
export type CompensationFormType = z.infer<typeof compensationFormSchema>;
export type UpdateRepairStatusType = z.infer<typeof updateRepairStatusSchema>;
export type RepairFormType = z.infer<typeof repairFormSchema>;
