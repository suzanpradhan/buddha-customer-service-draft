import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import {
  Button,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import {
  RemarksType,
  ReportDetailType,
} from '@/modules/reports/data/reportTypes';
import ticketApi from '@/modules/ticket/data/ticketApi';
import { remarksSchema } from '@/modules/ticket/data/ticketTypes';
import { useFormik } from 'formik';
import { Edit2, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

const DetailTab = ({ report }: { report: ReportDetailType }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showRemarksForm, toggleRemarksForm] = useState(false);

  useEffect(() => {
    dispatch(ticketApi.endpoints.getRemarks.initiate(report.ref_id));
  }, [dispatch, report.ref_id]);

  const remarks = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getRemarks("${report.ref_id!}")`]
        ?.data as RemarksType
  );

  useEffect(() => {
    if (!remarks?.title) {
      toggleRemarksForm(true);
      return;
    }
    return toggleRemarksForm(false);
  }, [remarks?.title]);

  const onSubmit = async (values: RemarksType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      dispatch(
        ticketApi.endpoints.addRemarks.initiate({
          ref_id: report.ref_id.toString(),
          ...values,
        })
      );
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: remarks?.title ?? '',
    },
    validate: toFormikValidate(remarksSchema),
    onSubmit,
  });

  return (
    <div className="m-4 flex flex-col">
      <div className="text-base">Description</div>
      <div className="text-sm mt-2">{report.description ?? 'No Summary'}</div>
      {/* <div className="text-base mt-4">Sources</div>
      <div className="flex mt-2 gap-2">
        <div className="border rounded-md px-4 py-2">Test</div>
        <div className="border rounded-md px-4 py-2">Test</div>
        <div className="border rounded-md px-4 py-2">Test</div>
        <div className="border rounded-md px-4 py-2">Test</div>
      </div> */}
      {remarks && remarks.title ? (
        <div className="p-4 rounded-lg bg-blueWhite border border-primaryGray-300 mt-4 max-w-5xl">
          <div className="flex justify-between">
            <div>Remarks</div>
            <div className="flex gap-2">
              <Button
                className="h-8 w-8"
                type="button"
                prefix={<Edit2 size={18} variant="Bold" />}
                onClick={() => {
                  toggleRemarksForm(true);
                }}
              />
              <Button
                className="h-8 w-8 bg-white"
                prefix={<Trash size={18} variant="Bold" />}
                type="button"
                kind="danger"
                onClick={() => {
                  dispatch(
                    ticketApi.endpoints.deleteRemarks.initiate({
                      ref_id: report.ref_id.toString(),
                      ...remarks,
                    })
                  );
                }}
              />
            </div>
          </div>
          <div className="text-sm mt-2">{remarks.title}</div>
        </div>
      ) : (
        <></>
      )}
      {showRemarksForm ? (
        <FormCard onSubmit={formik.handleSubmit} className="mt-4">
          <FormGroup>
            <div className="flex flex-col mb-2">
              <TextField
                id="title"
                type="text"
                label="Remarks"
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
                toggleRemarksForm(false);
              }}
            />
          </div>
        </FormCard>
      ) : (
        <></>
      )}
    </div>
  );
};
export default DetailTab;
