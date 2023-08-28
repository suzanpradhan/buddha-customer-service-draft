'use client';

import { selectorDataSchema } from '@/core/types/selectorTypes';
import { nonempty } from '@/core/utils/formUtils';
import { accountDetailSchema } from '@/modules/accounts/data/accountTypes';
import { flightDetailSchema } from '@/modules/flights/data/flightTypes';
import { severityDetailSchema } from '@/modules/severities/data/severityTypes';
import { sourceDetailSchema } from '@/modules/source/source/sourceTypes';
import { stationDetailSchema } from '@/modules/station/data/stationTypes';
import { statusDetailSchema } from '@/modules/status/data/statusTypes';
import { z } from 'zod';
import { remarksSchema } from './ticketTypes';

export const complainDetailSchema = z.object({
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

export const complainFormSchema = z.object({
  title: z.string().pipe(nonempty),
  description: z.string().optional(),
  flight: z.string().nullable().optional(),
  sources: z.array(selectorDataSchema).optional(),
  station: z.string().nullable().optional(),
  kind: z.string(),
  severity: z.string().optional(),
  status: z.string().optional(),
  owner: z.string().nullable().optional(),
  witness: z.string().nullable().optional(),
  assignee: z.string().nullable().optional(),
  files: z.array(z.instanceof(File)).optional(),
});

export const complainRequestSchema = complainFormSchema.extend({
  ref_id: z.string().optional(),
  sources: z.array(sourceDetailSchema).optional(),
});

export type ComplainRequestType = z.infer<typeof complainRequestSchema>;

export type ComplainDetailType = z.infer<typeof complainDetailSchema>;

export type ComplainFormType = z.infer<typeof complainFormSchema>;
