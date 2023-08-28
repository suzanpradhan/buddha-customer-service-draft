import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import Selector from '@/core/ui/components/Selector';
import {
  Button,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import surveyApi from '@/modules/survey/surveyApi';
import { questionKinds } from '@/modules/survey/surveyConstants';
import {
  QuestionnairesDetailType,
  QuestionnairesFormType,
  SurveyDetailType,
  questionnairesFormSchema,
} from '@/modules/survey/surveyTypes';
import { useFormik } from 'formik';
import { Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

interface QuestionnairesTabProps {
  survey: SurveyDetailType;
}

const QuestionnairesTab = (props: QuestionnairesTabProps) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!props.survey.ref_id) {
      return;
    }
    dispatch(
      surveyApi.endpoints.getQuestionnaire.initiate(props.survey.ref_id)
    );
  }, [dispatch, props.survey.ref_id]);

  const questionnaire = useGetApiResponse<QuestionnairesDetailType>(
    `getQuestionnaire("${props.survey.ref_id}")`
  );

  const onSubmit = async (values: QuestionnairesFormType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      if (questionnaire?.id) {
        await Promise.resolve(
          dispatch(
            surveyApi.endpoints.updateQuestionnaires.initiate({
              ...values,
            })
          )
        );
      } else {
        await Promise.resolve(
          dispatch(
            surveyApi.endpoints.createQuestionnaires.initiate({
              ...values,
            })
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
    formik.resetForm();
    setIsLoading(false);
  };

  const formik = useFormik<QuestionnairesFormType>({
    enableReinitialize: true,
    initialValues: {
      survey: props.survey.ref_id!,
      questions: questionnaire
        ? questionnaire.questions.map((question) => {
            return {
              id: question.id.toString(),
              kind: question.kind,
              question: question.question ?? '',
            };
          })
        : [
            {
              kind: 'short_answer',
              question: '',
            },
          ],
    },
    validate: toFormikValidate(questionnairesFormSchema),
    onSubmit,
  });

  const handleQuestionDelete = async (index: number) => {
    if (formik.values.questions.length <= 1) {
      return;
    }
    const question = formik.values.questions.splice(index, 1);
    const newQuestions = formik.values.questions;
    if (question[0].id) {
      await Promise.resolve(
        dispatch(surveyApi.endpoints.deleteQuestion.initiate(question[0].id))
      );
    }
    formik.setFieldValue('questions', newQuestions);
  };

  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div className="flex max-w-5xl justify-between items-center mb-4">
        <div className="flex flex-col">
          <div className="text-base">Questions</div>
          <div className="text-sm text-primaryGray-500">
            Click on add question below and start building engaging questions
          </div>
        </div>
      </div>
      {
        <FormCard onSubmit={formik.handleSubmit}>
          <FormGroup>
            <div className="max-w-5xl flex justify-end">
              <Button
                text="Add Question"
                className={`h-8 w-fit`}
                type="button"
                onClick={() => {
                  formik.setFieldValue(
                    `questions.${formik.values.questions.length}`,
                    {
                      kind: 'short_answer',
                      question: '',
                    }
                  );
                }}
              />
            </div>
          </FormGroup>
          <FormGroup>
            <div className="flex flex-col gap-4">
              {formik.values.questions.map((question, index) => {
                return (
                  <div
                    className="bg-white border rounded-lg p-4"
                    key={'question_' + index}
                  >
                    <div className="flex flex-col gap-2 items-start">
                      <div className="flex items-center w-full justify-between">
                        <div className="text-base">Q. no. {index + 1}</div>
                        <div className="flex text-sm gap-2 items-center">
                          <Button
                            className="h-8 w-8"
                            prefix={<Trash size={18} variant="Bold" />}
                            kind="danger"
                            type="button"
                            onClick={() => {
                              handleQuestionDelete(index);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col w-full mb-2">
                        <TextField
                          id="question"
                          type="text"
                          isMulti
                          label="Question"
                          className="flex-1"
                          required
                          {...formik.getFieldProps(
                            `questions.${index}.question`
                          )}
                        />
                      </div>
                      <Selector
                        id="kind_selector"
                        options={questionKinds}
                        label="Answer Type"
                        placeholder="Select question types"
                        className="flex-1 mb-2"
                        onChange={formik.setFieldValue}
                        value={
                          questionKinds.filter(
                            (kind) =>
                              kind.value == formik.values.questions[index].kind
                          )[0]
                        }
                        defaultValue={{
                          label: 'Short Answer',
                          value: 'short_answer',
                        }}
                        name={`questions.${index}.kind`}
                        required
                        type="Creatable"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </FormGroup>
          <div className="flex justify-end gap-2 m-4">
            <Button
              text="Submit"
              className="h-8 w-fit"
              type="submit"
              isLoading={isLoading}
            />
          </div>
        </FormCard>
      }
    </div>
  );
};
export default QuestionnairesTab;
