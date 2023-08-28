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
import severityApi from '@/modules/severities/data/severityApi';
import { SeverityDetailType } from '@/modules/severities/data/severityTypes';
import sourceApi from '@/modules/source/source/sourceApi';
import { SourceDetailType } from '@/modules/source/source/sourceTypes';
import stationApi from '@/modules/station/data/stationApi';
import { StationDetailType } from '@/modules/station/data/stationTypes';
import statusApi from '@/modules/status/data/statusApi';
import { StatusDetailType } from '@/modules/status/data/statusTypes';
import {
  ComplainDetailType,
  ComplainFormType,
  ComplainRequestType,
  complainFormSchema,
} from '@/modules/ticket/data/complainTypes';
import complainsApi from '@/modules/ticket/data/complainsApi';
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
      dispatch(complainsApi.endpoints.getComplain.initiate(params.ref_id[0]));
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
    dispatch(statusApi.endpoints.getAllStatusForComplains.initiate());
    dispatch(accountApi.endpoints.getAllUsers.initiate());
  }, []);

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
      state.baseApi.queries[`getAllStatusForComplains`]
        ?.data as StatusDetailType[]
  );
  const allUsers = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllUsers`]?.data as AccountDetailType[]
  );

  const complain = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[
        `getComplain("${params.ref_id ? params.ref_id[0] : undefined}")`
      ]?.data as ComplainDetailType
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

  const onSubmit = async ({ files, ...values }: ComplainFormType) => {
    var requestData: ComplainRequestType = {
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
            complainsApi.endpoints.updateComplain.initiate({
              ref_id: params.ref_id[0],
              ...requestData,
            })
          )
        );
      } else {
        data = await Promise.resolve(
          dispatch(complainsApi.endpoints.addComplain.initiate(requestData))
        );
      }
      if (files && Object.prototype.hasOwnProperty.call(data, 'data')) {
        await Promise.resolve(
          dispatch(
            attachmentApi.endpoints.uploadAttachments.initiate({
              ref_id: ((data as any).data as ComplainDetailType).ref_id,
              files: files,
            })
          )
        );
      }
      if (data) {
        navigate.push('admin/tickets/complains');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: complain?.title ?? '',
      description: complain?.description ?? '',
      flight: complain?.flight?.id ? complain.flight.id.toString() : undefined,
      sources:
        complain?.sources?.map(
          (source) =>
            ({
              value: source.id!.toString(),
              label: source.name,
            } as SelectorDataType)
        ) ?? [],
      station: complain?.station ? complain.station.id?.toString() : undefined,
      assignee: complain?.assignee
        ? complain.assignee.id?.toString()
        : undefined,
      kind: 'complain',
      severity: complain?.severity
        ? complain.severity.id?.toString()
        : undefined,
      status: complain?.status ? complain.status.id?.toString() : undefined,
      owner: complain?.owner ? complain.owner.id?.toString() : undefined,
      witness: complain?.witness ? complain.witness.id?.toString() : undefined,
      files: undefined,
    },
    validate: toFormikValidate(complainFormSchema),
    onSubmit,
  });

  console.log(formik.values);

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Complain Information">
        <div className="flex flex-col mb-2">
          <TextField
            id="title"
            type="text"
            label="Reason for Complain"
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
            label="Complain Description"
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
                complain?.flight
                  ? {
                      value: complain.flight.id!.toString(),
                      label: complain.flight.title,
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
                complain?.station
                  ? {
                      value: complain.station.id!.toString(),
                      label: complain.station.name,
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
              // defaultValue={formik.values.sources}
              options={allSources?.map(
                (source) =>
                  ({
                    value: source.id!.toString(),
                    label: source.name,
                  } as SelectorDataType)
              )}
              label="Sources"
              isMulti
              type="Creatable"
              placeholder="Select or create sources"
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
                complain?.severity
                  ? {
                      value: complain.severity.id!.toString(),
                      label: complain.severity.name,
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
              required
            ></Selector>
          )}
          {allStatus && (
            <Selector
              id="status_selector"
              defaultValue={
                complain?.status
                  ? {
                      value: complain.status.id!.toString(),
                      label: complain.status.title,
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
              required
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
                complain?.owner
                  ? {
                      value: complain.owner.id!.toString(),
                      label:
                        complain.owner.username ?? complain.owner.email ?? '--',
                      extra: complain.owner.profile?.avatar,
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
                complain?.witness
                  ? {
                      value: complain.witness.id!.toString(),
                      label:
                        complain.witness.username ??
                        complain.witness.email ??
                        '--',
                      extra: complain.witness.profile?.avatar,
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
              complain?.assignee
                ? {
                    value: complain.assignee.id!.toString(),
                    label:
                      complain.assignee.username ??
                      complain.assignee.email ??
                      '--',
                    extra: complain.assignee.profile?.avatar,
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
        <Button
          text="Cancel"
          className="h-8 w-fit"
          buttonType="bordered"
          onClick={() => {
            navigate.back();
          }}
        />
      </div>
    </FormCard>
  );
}
