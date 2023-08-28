/* eslint-disable @next/next/no-img-element */
import {
  Button,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import { SurveyDetailType } from '@/modules/survey/surveyTypes';
import { resolutionFormSchema } from '@/modules/ticket/data/ticketTypes';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';
// import { RxDotFilled } from 'react-icons/rx';

const ResolutionTab = ({ survey }: { survey: SurveyDetailType }) => {
  const [showEvaluationForm, toggleEvaluationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: any) => {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
    },
    validate: toFormikValidate(resolutionFormSchema),
    onSubmit,
  });

  return (
    <div className="m-4">
      <div className="flex flex-col gap-4">
        {showEvaluationForm ? (
          <></>
        ) : (
          <div className="max-w-5xl flex justify-end">
            <Button
              text="New User Evaluation"
              className={`h-8 w-fit`}
              type="button"
              onClick={() => {
                toggleEvaluationForm(true);
              }}
            />
          </div>
        )}

        {showEvaluationForm ? (
          <FormCard>
            <FormGroup>
              <div className="flex flex-col mb-2">
                <TextField
                  id="title"
                  type="text"
                  label="Title"
                  className="flex-1"
                  required
                  {...formik.getFieldProps('title')}
                />
                {!!formik.errors.title && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.title}
                  </div>
                )}
              </div>
            </FormGroup>
            <div className="flex justify-end gap-2 m-4">
              <Button
                text="Submit"
                className="h-8 w-fit"
                type="submit"
                isLoading={isLoading}
              />
              <Button
                text="Cancel"
                className="h-8 w-fit"
                buttonType="bordered"
                onClick={() => {
                  toggleEvaluationForm(false);
                }}
              />
            </div>
          </FormCard>
        ) : (
          <></>
        )}
        <div
          className="bg-blueWhite border border-primaryGray-300 rounded-lg p-4 max-w-5xl"
          key={1}
        >
          <div className="flex flex-col gap-2 items-start">
            <div className="flex items-center w-full justify-between">
              <div className="text-sm flex items-center gap-1">
                <img
                  src={'/images/avatar.jpg'}
                  alt="avatar"
                  className="object-cover w-6 h-6 rounded-md"
                />
                <span>Sujan Pradhan</span>
                {/* <RxDotFilled /> */}
                <span>28-Sept-2022 10:40 pm</span>
              </div>
              <div className="flex text-sm gap-2 items-center">
                Action:
                <div className="h-6 text-center bg-white px-3 rounded-md border">
                  Test
                </div>
              </div>
            </div>
            <div className="text-sm font-medium mt-2">
              hkbasd faskd fkasd fhkasd fhk askhdfhka sdfhaks dfhab sdfhab
              sdfhkba sdhkfba shdfb ashdfba shldfbashd f
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResolutionTab;
