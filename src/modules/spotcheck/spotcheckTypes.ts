import { selectorDataSchema } from '@/core/types/selectorTypes';
import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';
import { accountDetailSchema } from '../accounts/data/accountTypes';
import { stationDetailSchema } from '../station/data/stationTypes';

export const spotcheckDetailSchema = z.object({
  id: z.string().optional(),
  ref_id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  station: stationDetailSchema,
  assignee: accountDetailSchema,
  date: z.date().or(z.string()).optional(),
});

export const spotCheckFormSchema = spotcheckDetailSchema.extend({
  station: z.string().or(selectorDataSchema).optional(),
  assignee: z.string().or(selectorDataSchema).optional(),
});

export const spotCheckAttributeSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
});

export const spotCheckMarkSchema = z.object({
  id: z.string().optional(),
  spot_check_attribute: z.string().or(z.number()).optional(),
  mark: z.string().or(z.number()).optional(),
});

export const spotCheckMarkFormSchema = spotCheckMarkSchema;

export const spotCheckRatingSchema = z.object({
  id: z.string().optional(),
  user: accountDetailSchema,
  marks: z.array(spotCheckMarkSchema).optional(),
  improvement: z.string().optional(),
});

export const spotCheckRatingFormSchema = spotCheckRatingSchema.extend({
  user: z.string().optional(),
  spot_check: z.string().optional(),
  ratings_marks: z.array(spotCheckMarkFormSchema).optional(),
});

export const spotCheckEvaluationSchema = z.object({
  id: z.string().optional(),
  description: z.string().pipe(nonempty),
  kind: z.enum(['positive', 'improvement']).optional(),
});

export const spotCheckEvaluationFormSchema = spotCheckEvaluationSchema.extend({
  spot_check: z.string().optional(),
});

export type SpotCheckDetailType = z.infer<typeof spotcheckDetailSchema>;
export type SpotCheckFormType = z.infer<typeof spotCheckFormSchema>;
export type SpotCheckAttributeType = z.infer<typeof spotCheckAttributeSchema>;
export type SpotCheckMarkType = z.infer<typeof spotCheckMarkSchema>;
export type SpotCheckMarkFormType = z.infer<typeof spotCheckMarkFormSchema>;
export type SpotCheckRatingType = z.infer<typeof spotCheckRatingSchema>;
export type SpotCheckRatingFormType = z.infer<typeof spotCheckRatingFormSchema>;
export type SpotCheckEvaluationType = z.infer<typeof spotCheckEvaluationSchema>;
export type SpotCheckEvaluationFormType = z.infer<
  typeof spotCheckEvaluationFormSchema
>;
