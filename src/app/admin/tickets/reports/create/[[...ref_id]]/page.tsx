/* eslint-disable @next/next/no-img-element */
'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { SelectorDataType } from '@/core/types/selectorTypes';
import Selector from '@/core/ui/components/Selector';
import {
  Button,
  FormCard,
  FormGroup,
  MultiUploader,
  TextField,
} from '@/core/ui/zenbuddha/src';
import { ServerFileType } from '@/core/ui/zenbuddha/src/components/MultiUploader';
import accountApi from '@/modules/accounts/data/accountApi';
import { AccountDetailType } from '@/modules/accounts/data/accountTypes';
import attachmentApi from '@/modules/attachments/attachmentApi';
import { AttachmentType } from '@/modules/attachments/attachmentTypes';
import flightApi from '@/modules/flights/data/flightApi';
import { FlightDetailType } from '@/modules/flights/data/flightTypes';
import {
  ReportDetailType,
  ReportFormType,
  ReportRequestType,
  reportFormSchema,
} from '@/modules/reports/data/reportTypes';
import severityApi from '@/modules/severities/data/severityApi';
import { SeverityDetailType } from '@/modules/severities/data/severityTypes';
import sourceApi from '@/modules/source/source/sourceApi';
import { SourceDetailType } from '@/modules/source/source/sourceTypes';
import stationApi from '@/modules/station/data/stationApi';
import { StationDetailType } from '@/modules/station/data/stationTypes';
import statusApi from '@/modules/status/data/statusApi';
import { StatusDetailType } from '@/modules/status/data/statusTypes';
import ticketApi from '@/modules/ticket/data/ticketApi';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function TicketCreatePage({
  params,
}: {
  params: { ref_id?: string };
}) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();

  useEffect(() => {
    if (params.ref_id) {
      dispatch(ticketApi.endpoints.getReport.initiate(params.ref_id[0]));
      dispatch(
        attachmentApi.endpoints.getAttachmentList.initiate({
          ref_id: params.ref_id[0],
        })
      );
    }
  }, [dispatch, params.ref_id]);

  useEffect(() => {
    dispatch(flightApi.endpoints.getAllFlights.initiate(''));
    dispatch(severityApi.endpoints.getAllSeverities.initiate(''));
    dispatch(stationApi.endpoints.getAllStations.initiate(''));
    dispatch(sourceApi.endpoints.getAllSources.initiate(''));
    dispatch(statusApi.endpoints.getAllStatusForReports.initiate());
    dispatch(accountApi.endpoints.getAllUsers.initiate());
  }, [dispatch]);

  const report = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[
        `getReport("${params.ref_id ? params.ref_id[0] : undefined}")`
      ]?.data as ReportDetailType
  );
  const allFlights = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllFlights`]?.data as FlightDetailType[]
  );
  const allSeverities = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllSeverities`]?.data as SeverityDetailType[]
  );
  const allStations = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllStations`]?.data as StationDetailType[]
  );
  const allSources = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllSources`]?.data as SourceDetailType[]
  );
  const allStatus = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllStatusForReports`]
        ?.data as StatusDetailType[]
  );
  const allUsers = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllUsers`]?.data as AccountDetailType[]
  );
  const attachments = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAttachmentList`]?.data as AttachmentType[]
  );

  const formatOptionLabel = (props: SelectorDataType) => {
    return (
      <div className="flex gap-2 items-center">
        <img
          src={props.extra ?? '/images/avatar.jpg'}
          alt="avatar"
          className="object-cover w-6 h-6 rounded-md"
        />
        <div>{props.label}</div>
      </div>
    );
  };

  const onSubmit = async ({ files, ...values }: ReportFormType) => {
    var requestData: ReportRequestType = {
      ...values,
      sources: values.sources?.map((each) =>
        each.__isNew__
          ? { name: each.label! }
          : { id: parseInt(each.value), name: each.label }
      ),
    };

    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data;
      if (params.ref_id && params.ref_id[0]) {
        data = await Promise.resolve(
          dispatch(
            ticketApi.endpoints.updateReport.initiate({
              ref_id: params.ref_id[0],
              ...requestData,
            })
          )
        );
      } else {
        data = await Promise.resolve(
          dispatch(ticketApi.endpoints.addReport.initiate(requestData))
        );
      }

      if (files && Object.prototype.hasOwnProperty.call(data, 'data')) {
        await Promise.resolve(
          dispatch(
            attachmentApi.endpoints.uploadAttachments.initiate({
              ref_id: ((data as any).data as ReportDetailType).ref_id,
              files: files,
            })
          )
        );
      }
      if (data) {
        navigate.push('admin/tickets/reports');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: report?.title ?? '',
      description: report?.description ?? '',
      flight: report?.flight?.id ? report.flight.id.toString() : undefined,
      sources:
        report?.sources?.map(
          (source) =>
            ({
              value: source.id!.toString(),
              label: source.name,
            } as SelectorDataType)
        ) ?? [],
      station: report?.station ? report.station.id?.toString() : undefined,
      assignee: report?.assignee ? report.assignee.id?.toString() : undefined,
      kind: 'report',
      severity: report?.severity ? report.severity.id?.toString() : undefined,
      status: report?.status ? report.status.id?.toString() : undefined,
      owner: report?.owner ? report.owner.id?.toString() : undefined,
      witness: report?.witness ? report.witness.id?.toString() : undefined,
      files: undefined,
    },
    validate: toFormikValidate(reportFormSchema),
    onSubmit,
  });

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Ticket Information">
        <div className="flex flex-col mb-2">
          <TextField
            id="title"
            type="text"
            label="Subject"
            className="flex-1"
            required
            {...formik.getFieldProps('title')}
          />
          {!!formik.errors.title && (
            <div className="text-red-500 text-sm">{formik.errors.title}</div>
          )}
        </div>
        <div className="flex flex-col mb-2">
          <TextField
            id="description"
            type="text"
            label="Description"
            className="flex-1 mb-2"
            isMulti
            {...formik.getFieldProps('description')}
          />
          {!!formik.errors.description && (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          {allFlights && (
            <Selector
              id="flight_selector"
              defaultValue={
                report?.flight
                  ? {
                      value: report.flight.id!.toString(),
                      label: report.flight.title,
                    }
                  : undefined
              }
              options={allFlights
                ?.filter((flight) => flight.id)
                .map(
                  (flight) =>
                    ({
                      value: flight.id!.toString(),
                      label: flight.title,
                    } as SelectorDataType)
                )}
              label="Flight"
              placeholder="Select or create flight"
              className="flex-1 mb-2"
              onChange={formik.setFieldValue}
              name="flight"
            />
          )}
          {allStations && (
            <Selector
              id="station_selector"
              defaultValue={
                report?.station
                  ? {
                      value: report.station.id!.toString(),
                      label: report.station.name,
                    }
                  : undefined
              }
              options={allStations?.map(
                (station) =>
                  ({
                    value: station.id!.toString(),
                    label: station.name,
                  } as SelectorDataType)
              )}
              label="Station"
              placeholder="Select or create station"
              className="flex-1 mb-2"
              onChange={formik.setFieldValue}
              name="station"
            ></Selector>
          )}
        </div>
        <div className="flex flex-col mb-2">
          {allSources && (
            <Selector
              id="source_selector"
              options={allSources?.map(
                (source) =>
                  ({
                    value: source.id!.toString(),
                    label: source.name,
                  } as SelectorDataType)
              )}
              label="Sources"
              isMulti
              // isCreateAble
              placeholder="Select sources"
              className="flex-1"
              onChange={formik.setFieldValue}
              name="sources"
              value={formik.values.sources}
            />
          )}
        </div>
      </FormGroup>
      <FormGroup title="States">
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          {allSeverities && (
            <Selector
              id="severity_selector"
              defaultValue={
                report?.severity
                  ? {
                      value: report.severity.id!.toString(),
                      label: report.severity.name,
                    }
                  : undefined
              }
              options={allSeverities?.map(
                (severity) =>
                  ({
                    value: severity.id!.toString(),
                    label: severity.name,
                  } as SelectorDataType)
              )}
              label="Severity"
              placeholder="Select or create severity"
              className="flex-1 mb-2"
              onChange={formik.setFieldValue}
              name="severity"
            ></Selector>
          )}
          {allStatus && (
            <Selector
              id="status_selector"
              defaultValue={
                report?.status
                  ? {
                      value: report.status.id!.toString(),
                      label: report.status.title,
                    }
                  : undefined
              }
              options={allStatus?.map(
                (status) =>
                  ({
                    value: status.id!.toString(),
                    label: status.title,
                  } as SelectorDataType)
              )}
              label="Status"
              placeholder="Select or create status"
              className="flex-1 mb-2"
              onChange={formik.setFieldValue}
              name="status"
            ></Selector>
          )}
        </div>
      </FormGroup>
      <FormGroup title="Participants">
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          {allUsers && (
            <Selector
              id="ticket_owner_selector"
              defaultValue={
                report?.owner
                  ? {
                      value: report.owner.id!.toString(),
                      label:
                        report.owner.username ?? report.owner.email ?? '--',
                      extra: report.owner.profile?.avatar,
                    }
                  : undefined
              }
              options={allUsers?.map(
                (user) =>
                  ({
                    value: user.id!.toString(),
                    label: user.username,
                    extra: user.profile?.avatar,
                  } as SelectorDataType)
              )}
              label="Ticket Owner"
              placeholder="Select or create ticket owner"
              className="flex-1 mb-2"
              formatOptionLabel={formatOptionLabel}
              onChange={formik.setFieldValue}
              name="owner"
            ></Selector>
          )}
          {allUsers && (
            <Selector
              id="witness_selector"
              defaultValue={
                report?.witness
                  ? {
                      value: report.witness.id!.toString(),
                      label:
                        report.witness.username ?? report.witness.email ?? '--',
                      extra: report.witness.profile?.avatar,
                    }
                  : undefined
              }
              options={allUsers?.map(
                (user) =>
                  ({
                    value: user.id!.toString(),
                    label: user.username,
                    extra: user.profile?.avatar,
                  } as SelectorDataType)
              )}
              label="Witness"
              placeholder="Select or create witness"
              formatOptionLabel={formatOptionLabel}
              className="flex-1 mb-2"
              onChange={formik.setFieldValue}
              name="witness"
            ></Selector>
          )}
        </div>
        {allUsers && (
          <Selector
            id="assignee_selector"
            defaultValue={
              report?.assignee
                ? {
                    value: report.assignee.id!.toString(),
                    label:
                      report.assignee.username ?? report.assignee.email ?? '--',
                    extra: report.assignee.profile?.avatar,
                  }
                : undefined
            }
            options={allUsers?.map(
              (user) =>
                ({
                  value: user.id!.toString(),
                  label: user.username,
                  extra: user.profile?.avatar,
                } as SelectorDataType)
            )}
            label="Assignee"
            formatOptionLabel={formatOptionLabel}
            placeholder="Select or create assignee"
            className="flex-1 mb-2"
            onChange={formik.setFieldValue}
            name="assignee"
          ></Selector>
        )}
      </FormGroup>
      <FormGroup title="Attachments">
        <MultiUploader
          onServerAttachmentRemove={(file: ServerFileType) => {
            dispatch(
              attachmentApi.endpoints.deleteAttachment.initiate({
                id: file.id,
              })
            );
          }}
          serverFiles={
            params.ref_id && params.ref_id[0]
              ? attachments?.map((attachment) => {
                  return {
                    id: attachment.id,
                    file_type: attachment.file_type,
                    url: attachment.file,
                  };
                })
              : []
          }
          name="files"
          setFieldValue={formik.setFieldValue}
          files={formik.values.files}
        />
      </FormGroup>
      <div className="flex justify-end gap-2 m-4">
        <Button
          text="Submit"
          className="h-8 w-fit"
          type="submit"
          isLoading={isLoading}
        />
        <Button text="Cancel" className="h-8 w-fit" buttonType="bordered" />
      </div>
    </FormCard>
  );
}
