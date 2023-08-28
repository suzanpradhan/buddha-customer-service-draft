import { selectorDataSchema } from '@/core/types/selectorTypes';
import { nonempty } from '@/core/utils/formUtils';
import { accountDetailSchema } from '@/modules/accounts/data/accountTypes';
import { flightDetailSchema } from '@/modules/flights/data/flightTypes';
import { severityDetailSchema } from '@/modules/severities/data/severityTypes';
import { sourceDetailSchema } from '@/modules/source/source/sourceTypes';
import { stationDetailSchema } from '@/modules/station/data/stationTypes';
import { statusDetailSchema } from '@/modules/status/data/statusTypes';
import { remarksSchema } from '@/modules/ticket/data/ticketTypes';
import { z } from 'zod';

export const reportFormSchema = z.object({
  title: z.string().pipe(nonempty),
  description: z.string().optional(),
  flight: z.string().optional(),
  sources: z.array(selectorDataSchema).optional(),
  station: z.string().optional(),
  kind: z.string(),
  severity: z.string().optional(),
  status: z.string().optional(),
  owner: z.string().optional(),
  witness: z.string().optional(),
  assignee: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
});

export const reportRequestSchema = reportFormSchema.extend({
  ref_id: z.string().optional(),
  sources: z.array(sourceDetailSchema).optional(),
});

export const reportDetailSchema = z.object({
  id: z.number().or(z.string()),
  ref_id: z.string(),
  title: z.string().pipe(nonempty),
  description: z.string().optional(),
  flight: flightDetailSchema.optional(),
  sources: z.array(sourceDetailSchema).optional(),
  station: stationDetailSchema.optional(),
  remarks: remarksSchema.optional(),
  kind: z.string(),
  severity: severityDetailSchema,
  status: statusDetailSchema,
  owner: accountDetailSchema,
  witness: accountDetailSchema,
  assignee: accountDetailSchema,
  created_on: z.string().optional(),
  modified_on: z.date().optional(),
});

export type ReportRequestType = z.infer<typeof reportRequestSchema>;

export type ReportFormType = z.infer<typeof reportFormSchema>;

export type RemarksType = z.infer<typeof remarksSchema>;

export type ReportDetailType = z.infer<typeof reportDetailSchema>;
