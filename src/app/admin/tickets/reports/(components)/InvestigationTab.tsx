/* eslint-disable @next/next/no-img-element */
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import {
  Button,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import investigationApi from '@/modules/investigation/investigationApi';
import {
  InvestigationDetailType,
  investigationDetailSchema,
} from '@/modules/investigation/investigationType';
import { ReportDetailType } from '@/modules/reports/data/reportTypes';
import { useFormik } from 'formik';
import { Edit2, Trash } from 'iconsax-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

const InvestigationTab = ({ report }: { report: ReportDetailType }) => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showInvestigationForm, toggleInvestigationForm] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    dispatch(
      investigationApi.endpoints.getInvestigationList.initiate({
        page: pageIndex + 1,
        ref_id: report.ref_id,
      })
    );
  }, [dispatch, pageIndex, report.ref_id]);

  const investigationPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getInvestigationList`]
        ?.data as PaginatedResponseType<InvestigationDetailType>
  );

  const onSubmit = async (values: InvestigationDetailType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      if (values.id) {
        dispatch(
          investigationApi.endpoints.updateInvestigation.initiate({
            ...values,
          })
        );
      } else {
        dispatch(
          investigationApi.endpoints.addInvestigation.initiate({
            ref_id: report.ref_id.toString(),
            ...values,
          })
        );
      }
      toggleInvestigationForm(false);
    } catch (error) {
      console.log(error);
    }
    formik.resetForm();
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      findings: '',
      recommendation: '',
      cause: '',
    },
    validate: toFormikValidate(investigationDetailSchema),
    onSubmit,
  });

  return (
    <>
      <AlertDialog
        isOpen={modalIsOpen}
        deleteContent={onDelete?.title}
        onClickNo={() => {
          setIsOpen(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(
                investigationApi.endpoints.deleteInvestigation.initiate(
                  onDelete
                )
              )
            );
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="m-4">
        <div className="flex flex-col gap-4">
          {showInvestigationForm ? (
            <></>
          ) : (
            <div className="max-w-5xl flex justify-end">
              <Button
                text="Add Investigation"
                className={`h-8 w-fit`}
                type="button"
                onClick={() => {
                  toggleInvestigationForm(true);
                }}
              />
            </div>
          )}

          {showInvestigationForm ? (
            <FormCard onSubmit={formik.handleSubmit}>
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
                <div className="flex flex-col mb-2">
                  <TextField
                    id="findings"
                    type="text"
                    label="Findings"
                    className="flex-1"
                    rows={3}
                    required
                    isMulti
                    {...formik.getFieldProps('findings')}
                  />
                  {!!formik.errors.findings && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.findings}
                    </div>
                  )}
                </div>
                <div className="flex flex-col mb-2">
                  <TextField
                    id="cause"
                    type="text"
                    label="Cause"
                    className="flex-1"
                    rows={3}
                    required
                    isMulti
                    {...formik.getFieldProps('cause')}
                  />
                  {!!formik.errors.cause && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.cause}
                    </div>
                  )}
                </div>
                <div className="flex flex-col mb-2">
                  <TextField
                    id="recommendation"
                    type="text"
                    label="Recommendation"
                    className="flex-1"
                    rows={3}
                    required
                    isMulti
                    {...formik.getFieldProps('recommendation')}
                  />
                  {!!formik.errors.recommendation && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.recommendation}
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
                    formik.resetForm();
                    toggleInvestigationForm(false);
                  }}
                />
              </div>
            </FormCard>
          ) : (
            <></>
          )}

          {investigationPaginatedData?.results?.map((investigation, index) => {
            return (
              <div
                className="bg-blueWhite border border-primaryGray-300 rounded-lg p-4 max-w-5xl"
                key={index}
              >
                <div className="flex flex-col gap-2 items-start">
                  <div className="flex justify-between w-full">
                    <div className="text-sm flex items-center gap-1">
                      {/* <img
                      src={'/images/avatar.jpg'}
                      alt="avatar"
                      className="object-cover w-6 h-6 rounded-md"
                    /> */}
                      {/* <span>Sujan Pradhan</span> */}
                      {/* <RxDotFilled /> */}
                      <span>
                        {(investigation?.created_on
                          ? moment(investigation.created_on).format('llll')
                          : ''
                        ).toString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="h-8 w-8"
                        type="button"
                        prefix={<Edit2 size={18} variant="Bold" />}
                        onClick={() => {
                          toggleInvestigationForm(true);
                          formik.setValues({
                            id: investigation.id,
                            title: investigation.title,
                            findings: investigation.findings,
                            recommendation: investigation.recommendation,
                            cause: investigation.cause,
                          });
                        }}
                      />
                      <Button
                        className="h-8 w-8 bg-white"
                        prefix={<Trash size={18} variant="Bold" />}
                        kind="danger"
                        type="button"
                        onClick={() => {
                          setOnDelete(investigation);
                          setIsOpen(true);
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-sm font-medium mt-2">
                    {investigation.title}
                  </div>
                  {investigation.findings ? (
                    <>
                      <div className="text-sm">Findings</div>
                      <div className="text-sm text-primaryGray-500">
                        {investigation.findings}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {investigation.cause ? (
                    <>
                      <div className="text-sm">Cause</div>
                      <div className="text-sm text-primaryGray-500">
                        {investigation.cause}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {investigation.recommendation ? (
                    <>
                      <div className="text-sm">Recommendation</div>
                      <div className="text-sm text-primaryGray-500">
                        {investigation.recommendation}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default InvestigationTab;
