'use client';

/* eslint-disable @next/next/no-img-element */
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import {
  Button,
  FormCard,
  FormGroup,
  MultiUploader,
} from '@/core/ui/zenbuddha/src';
import { ServerFileType } from '@/core/ui/zenbuddha/src/components/MultiUploader';
import attachmentApi from '@/modules/attachments/attachmentApi';
import {
  AttachmentFormType,
  AttachmentType,
} from '@/modules/attachments/attachmentTypes';
import { ReportDetailType } from '@/modules/reports/data/reportTypes';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';

const AttachmentsTab = ({ report }: { report: ReportDetailType }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [toViewFile, setToViewFile] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(
      attachmentApi.endpoints.getAttachmentList.initiate({
        ref_id: report.ref_id,
      })
    );
  }, [dispatch, report.ref_id]);

  const attachments = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAttachmentList`]?.data as AttachmentType[]
  );

  const onSubmit = async (values: AttachmentFormType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      await Promise.resolve(
        dispatch(
          attachmentApi.endpoints.uploadAttachments.initiate({
            ...values,
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
    formik.resetForm();
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ref_id: report.ref_id,
      files: undefined,
    },
    onSubmit,
  });

  return (
    <div className="m-4 flex flex-col h-full gap-4">
      <FormCard onSubmit={formik.handleSubmit}>
        <FormGroup>
          <MultiUploader
            onServerAttachmentRemove={(file: ServerFileType) => {
              dispatch(
                attachmentApi.endpoints.deleteAttachment.initiate({
                  id: file.id,
                })
              );
            }}
            serverFiles={attachments?.map((attachment) => {
              return {
                id: attachment.id,
                file_type: attachment.file_type,
                url: attachment.file,
              };
            })}
            files={formik.values.files}
            setFieldValue={formik.setFieldValue}
            name="files"
          />
        </FormGroup>
        <div className="max-w-5xl flex justify-end m-4">
          <Button
            text="Upload Files"
            className={`h-8 w-fit`}
            type="submit"
            isLoading={isLoading}
          />
        </div>
      </FormCard>

      {/* <div className="w-20 h-20 absolute bg-red-500 top-10 left-10">
        asdasdf
      </div> */}
    </div>
  );
};
export default AttachmentsTab;
