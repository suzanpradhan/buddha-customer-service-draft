/* eslint-disable @next/next/no-img-element */
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import Selector from '@/core/ui/components/Selector';
import {
  Button,
  FormCard,
  FormGroup,
  TableCard,
  TextField,
  tableStyles,
} from '@/core/ui/zenbuddha/src';
import spotCheckApi from '@/modules/spotcheck/spotcheckApi';
import {
  SpotCheckDetailType,
  SpotCheckEvaluationFormType,
  SpotCheckEvaluationType,
  spotCheckEvaluationFormSchema,
} from '@/modules/spotcheck/spotcheckTypes';
import { evaluationKinds } from '@/modules/status/data/statusConstants';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

interface SpotCheckEvaluationProps {
  spotCheck: SpotCheckDetailType;
}

const SpotCheckEvaluationTab = (props: SpotCheckEvaluationProps) => {
  const dispatch = useAppDispatch();
  const [maxIteration, setMaxIteration] = useState(0);
  const [positiveEvaluations, setPositiveEvaluations] = useState<
    SpotCheckEvaluationType[]
  >([]);
  const [improvementEvaluations, setImprovementEvaluations] = useState<
    SpotCheckEvaluationType[]
  >([]);
  const [showEvaluationForm, toggleEvaluationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.spotCheck.ref_id) {
      dispatch(
        spotCheckApi.endpoints.getSpotCheckEvaluationsList.initiate({
          ref_id: props.spotCheck.ref_id,
        })
      );
    }
  }, [dispatch]);

  const allSpotCheckEvaluationsList = useGetApiResponse<
    SpotCheckEvaluationType[]
  >('getSpotCheckEvaluationsList');

  useEffect(() => {
    if (allSpotCheckEvaluationsList) {
      var tempPositiveEvaluations = allSpotCheckEvaluationsList.filter(
        (spotCheckEvaluation) => spotCheckEvaluation.kind === 'positive'
      );
      setPositiveEvaluations(tempPositiveEvaluations);
      var tempImprovementEvaluations = allSpotCheckEvaluationsList.filter(
        (spotCheckEvaluation) => spotCheckEvaluation.kind === 'improvement'
      );
      setImprovementEvaluations(tempImprovementEvaluations);
      setMaxIteration(
        Math.max(
          tempPositiveEvaluations.length,
          tempImprovementEvaluations.length
        )
      );
    }
  }, [allSpotCheckEvaluationsList]);

  function generateTableRows() {
    if (!allSpotCheckEvaluationsList) {
      return <></>;
    }
    var listOfRows: React.ReactNode[] = [];
    for (let iteration = 0; iteration < maxIteration; iteration++) {
      listOfRows.push(
        <tr
          className={tableStyles.table_tbody_tr}
          key={'evaluation' + '_' + iteration}
        >
          <td className={tableStyles.table_td + ' w-1/2'} valign="top">
            {positiveEvaluations[iteration]?.description}
          </td>
          <td className={tableStyles.table_td + ' w-1/2'} valign="top">
            {improvementEvaluations[iteration]?.description}
          </td>
        </tr>
      );
    }
    return listOfRows;
  }

  const onSubmit = async (values: SpotCheckEvaluationFormType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      await Promise.resolve(
        dispatch(
          spotCheckApi.endpoints.addSpotCheckEvaluation.initiate({
            ...values,
          })
        )
      );
      toggleEvaluationForm(false);
    } catch (error) {
      console.log(error);
    }
    formik.resetForm();
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      kind: 'positive',
      description: '',
      spot_check: props.spotCheck.id,
    },
    validate: toFormikValidate(spotCheckEvaluationFormSchema),
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
              text="Add SpotCheck Evaluation"
              className={`h-8 w-fit`}
              type="button"
              onClick={() => {
                toggleEvaluationForm(true);
              }}
            />
          </div>
        )}

        {showEvaluationForm ? (
          <FormCard onSubmit={formik.handleSubmit}>
            <FormGroup>
              <div className="flex flex-col mb-2">
                <TextField
                  id="description"
                  type="text"
                  label="Description"
                  className="flex-1"
                  isMulti
                  required
                  {...formik.getFieldProps('description')}
                />
                {!!formik.errors.description && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.description}
                  </div>
                )}
              </div>
              <div className="flex flex-col mb-2">
                <Selector
                  id="kind_selector"
                  options={evaluationKinds}
                  label="Evaluation Kind"
                  placeholder="Select kind"
                  className="flex-1 mb-2"
                  defaultValue={evaluationKinds[0]}
                  onChange={formik.setFieldValue}
                  name="kind"
                  required
                />
                {!!formik.errors.kind && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.kind}
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
        <div className="flex flex-col max-w-5xl w-full">
          <div className="bg-blueWhite border border-primaryGray-300 rounded-lg w-full max-w-5xl overflow-hidden">
            <TableCard>
              <thead>
                <tr className={tableStyles.table_thead_tr}>
                  <th className={tableStyles.table_th + ' w-1/2'}>Positive</th>
                  <th className={tableStyles.table_th + ' w-1/2'}>
                    Improvement Required
                  </th>
                </tr>
              </thead>
              <tbody>{generateTableRows()}</tbody>
            </TableCard>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SpotCheckEvaluationTab;
