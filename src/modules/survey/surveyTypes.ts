import { selectorDataSchema } from '@/core/types/selectorTypes';
import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';
import { profileDetailSchema } from '../accounts/data/accountTypes';
import { flightDetailSchema } from '../flights/data/flightTypes';
import { stationDetailSchema } from '../station/data/stationTypes';

export const surveyDetailSchema = z.object({
  id: z.number().optional(),
  ref_id: z.string().optional(),
  title: z.string().pipe(nonempty),
  description: z.string().optional(),
  kind: z.string(),
  start_date: z.date().or(z.string()).optional(),
  end_date: z.date().or(z.string()).optional(),
});

export const surveyParticipantsSchema = z.object({
  id: z.string().optional(),
  profile: profileDetailSchema,
  flight: flightDetailSchema,
  station: stationDetailSchema,
  is_submitted: z.boolean().optional(),
});

export const surveyParticipantCreateFormSchema = profileDetailSchema.extend({
  id: z.string().optional(),
  survey: z.string(),
  station: z.string().optional(),
  flight: z.string().optional(),
});

export const surveyMultipleParticipantSchema = z.object({
  survey_ref_id: z.string(),
  profiles: z.array(z.string()).or(z.array(selectorDataSchema)).optional(),
});

export const surveyFeedbackSchema = z.object({
  id: z.string().optional(),
  kind: z.string(),
  text: z.string(),
});

export const questionFormSchema = z.object({
  id: z.string().optional(),
  question: z.string().optional(),
  kind: z.string(),
});

export const questionDetailSchema = questionFormSchema.extend({
  id: z.string(),
  question: z.string().optional(),
});

export const questionnairesFormSchema = z.object({
  survey: z.string(),
  questions: z.array(questionFormSchema),
});

export const questionnairesDetailSchema = z.object({
  id: z.string(),
  questions: z.array(questionDetailSchema),
});

export const answerDetailSchema = z.object({
  value: z.string().optional(),
});

export const surveyQuestionAttemptSchema = z.object({
  answers: z.array(answerDetailSchema),
  question: questionDetailSchema,
});

export const surveyQuestionnaireAttemptDetailSchema = z.object({
  question_attempts: z.array(surveyQuestionAttemptSchema),
});

export type SurveyMultipleParticipantType = z.infer<
  typeof surveyMultipleParticipantSchema
>;
export type SurveyParticipantsType = z.infer<typeof surveyParticipantsSchema>;
export type SurveyDetailType = z.infer<typeof surveyDetailSchema>;
export type SurveyParticipantCreateFormType = z.infer<
  typeof surveyParticipantCreateFormSchema
>;
export type SurveyFeedbackType = z.infer<typeof surveyFeedbackSchema>;
export type QuestionFormType = z.infer<typeof questionFormSchema>;
export type QuestionnairesFormType = z.infer<typeof questionnairesFormSchema>;
export type QuestionDetailType = z.infer<typeof questionDetailSchema>;
export type QuestionnairesDetailType = z.infer<
  typeof questionnairesDetailSchema
>;
export type SurveyQuestionnaireAttemptDetailType = z.infer<
  typeof surveyQuestionnaireAttemptDetailSchema
>;
