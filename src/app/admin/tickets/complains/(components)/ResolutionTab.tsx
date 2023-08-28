/* eslint-disable @next/next/no-img-element */
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { SelectorDataType } from '@/core/types/selectorTypes';
import Selector from '@/core/ui/components/Selector';
import {
  Button,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import { ReportDetailType } from '@/modules/reports/data/reportTypes';
import { StatusDetailType } from '@/modules/status/data/statusTypes';
import complainsApi from '@/modules/ticket/data/complainsApi';
import {
  ResolutionFormType,
  ResolutionType,
  resolutionFormSchema,
} from '@/modules/ticket/data/ticketTypes';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';
// import { RxDotFilled } from 'react-icons/rx';

const ResolutionTab = ({ report }: { report: ReportDetailType }) => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResolutionForm, toggleResolutionForm] = useState(false);

  const allStatus = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllStatusForComplains`]
        ?.data as StatusDetailType[]
  );

  useEffect(() => {
    dispatch(
      complainsApi.endpoints.getComplainResolutionsList.initiate({
        page: pageIndex + 1,
        ref_id: report.ref_id,
      })
    );
  }, [dispatch, pageIndex, report.ref_id]);

  const resolutionsPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getComplainResolutionsList`]
        ?.data as PaginatedResponseType<ResolutionType>
  );

  const onSubmit = async (values: ResolutionFormType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      dispatch(
        complainsApi.endpoints.addComplainResolution.initiate({
          ref_id: report.ref_id.toString(),
          title: values.title,
          status: values.status,
        })
      );
      toggleResolutionForm(false);
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
    },
    validate: toFormikValidate(resolutionFormSchema),
    onSubmit,
  });

  return (
    <div className="m-4">
      <div className="flex flex-col gap-4">
        {showResolutionForm ? (
          <></>
        ) : (
          <div className="max-w-5xl flex justify-end">
            <Button
              text="Add Resolution"
              className={`h-8 w-fit`}
              type="button"
              onClick={() => {
                toggleResolutionForm(true);
              }}
            />
          </div>
        )}

        {showResolutionForm ? (
          <FormCard onSubmit={formik.handleSubmit}>
            <FormGroup>
              <div className="flex flex-col mb-2">
                <TextField
                  id="title"
                  type="text"
                  label="Summary"
                  isMulti
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
              {allStatus && (
                <Selector
                  id="status_selector"
                  options={allStatus?.map(
                    (status) =>
                      ({
                        value: status.id!.toString(),
                        label: status.title,
                      } as SelectorDataType)
                  )}
                  label="Status"
                  placeholder="Select status"
                  className="flex-1 mb-2"
                  onChange={formik.setFieldValue}
                  name="status"
                ></Selector>
              )}
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
                  toggleResolutionForm(false);
                }}
              />
            </div>
          </FormCard>
        ) : (
          <></>
        )}
        {resolutionsPaginatedData?.results?.map((resolution, index) => {
          return (
            <div
              className="bg-blueWhite border border-primaryGray-300 rounded-lg p-4 max-w-5xl"
              key={index}
            >
              <div className="flex flex-col gap-2 items-start">
                <div className="flex items-start w-full justify-between">
                  <div className="text-sm font-medium">{resolution.title}</div>
                  {resolution.status ? (
                    <div className="flex text-sm gap-2 items-center">
                      Action:
                      <div className="h-6 text-center bg-white px-3 rounded-md border">
                        {
                          allStatus?.filter(
                            (status) => status.id == resolution.status
                          )[0]?.title
                        }
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ResolutionTab;
