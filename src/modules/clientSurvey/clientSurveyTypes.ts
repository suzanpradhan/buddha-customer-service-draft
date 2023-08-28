import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';
import { profileDetailSchema } from '../accounts/data/accountTypes';
import { flightDetailSchema } from '../flights/data/flightTypes';
import { stationDetailSchema } from '../station/data/stationTypes';
import { surveyDetailSchema } from '../survey/surveyTypes';

export const clientSurveyParticipantSchema = z.object({
  id: z.string().optional(),
  profile: profileDetailSchema,
  flight: flightDetailSchema,
  station: stationDetailSchema,
  survey: surveyDetailSchema,
  is_submitted: z.boolean().optional(),
});

export const clientSurveyFeedBackFormItemSchema = z.object({
  key: z.string().or(z.number()),
  kind: z.enum(['positive', 'negative', 'recommendation']),
  text: z.string().optional(),
});

export const clientSurveyFeedbackFormSchema = z.object({
  positives: z.array(clientSurveyFeedBackFormItemSchema),
  negatives: z.array(clientSurveyFeedBackFormItemSchema),
  recommendations: z.array(clientSurveyFeedBackFormItemSchema),
});

export const clientSurveyFeedbackRequestSchema = z.object({
  survey_respond: z.string(),
  evaluations: z.array(clientSurveyFeedBackFormItemSchema),
});

export const clientAnswerFormSchema = z.object({
  value: z.string().pipe(nonempty),
});

export const clientQuestionAttemptFormSchema = z.object({
  question: z.string(),
  answers: z.array(clientAnswerFormSchema),
});

export const clientQuestionnaireAttemptFormSchema = z.object({
  questionnaire: z.string().optional(),
  survey_respond: z.string().optional(),
  question_attempts: z.array(clientQuestionAttemptFormSchema),
});

export type ClientSurveyParticipantType = z.infer<
  typeof clientSurveyParticipantSchema
>;

export type ClientSurveyFeedbackFormItemType = z.infer<
  typeof clientSurveyFeedBackFormItemSchema
>;

export type ClientSurveyFeedbackFormType = z.infer<
  typeof clientSurveyFeedbackFormSchema
>;

export type ClientSurveyFeedbackRequestType = {
  survey_respond: string;
  evaluations: ClientSurveyFeedbackFormItemType[];
};

export type ClientQuestionnaireAttemptFormType = z.infer<
  typeof clientQuestionnaireAttemptFormSchema
>;
