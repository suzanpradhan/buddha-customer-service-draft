/* eslint-disable @next/next/no-img-element */
'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { SelectorDataType } from '@/core/types/selectorTypes';
import Selector from '@/core/ui/components/Selector';
import {
  Button,
  DateSelector,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import accountApi from '@/modules/accounts/data/accountApi';
import { AccountDetailType } from '@/modules/accounts/data/accountTypes';
import flightApi from '@/modules/flights/data/flightApi';
import { FlightDetailType } from '@/modules/flights/data/flightTypes';
import severityApi from '@/modules/severities/data/severityApi';
import { SeverityDetailType } from '@/modules/severities/data/severityTypes';
import statusApi from '@/modules/status/data/statusApi';
import { StatusDetailType } from '@/modules/status/data/statusTypes';
import repairsApi from '@/modules/ticket/data/repairsApis';
import {
  RepairDetailType,
  RepairFormType,
  repairFormSchema,
} from '@/modules/ticket/data/repairsTypes';
import { useFormik } from 'formik';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

export default function RepairTicketCreatePage({
  params,
}: {
  params: { ref_id?: string };
}) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();

  useEffect(() => {
    if (params.ref_id) {
      dispatch(repairsApi.endpoints.getRepair.initiate(params.ref_id[0]));
    }
  }, [dispatch, params.ref_id]);

  useEffect(() => {
    dispatch(flightApi.endpoints.getAllFlights.initiate(''));
    dispatch(severityApi.endpoints.getAllSeverities.initiate(''));
    dispatch(statusApi.endpoints.getAllStatusForRepairs.initiate());
    dispatch(accountApi.endpoints.getAllUsers.initiate());
  }, [dispatch]);

  const repair = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[
        `getRepair("${params.ref_id ? params.ref_id[0] : undefined}")`
      ]?.data as RepairDetailType
  );

  const allFlights = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllFlights`]?.data as FlightDetailType[]
  );
  const allSeverities = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllSeverities`]?.data as SeverityDetailType[]
  );
  const allStatus = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllStatusForRepairs`]
        ?.data as StatusDetailType[]
  );
  const allUsers = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllUsers`]?.data as AccountDetailType[]
  );

  const formatOptionLabel = (props: SelectorDataType) => {
    return (
      <div className="flex gap-2 items-center">
        <div>{props.label}</div>
      </div>
    );
  };

  const onSubmit = async (requestData: RepairFormType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    if (requestData.issued_date) {
      requestData.issued_date = moment(requestData.issued_date).format(
        'YYYY-MM-DD'
      );
    }
    if (requestData.received_date) {
      requestData.received_date = moment(requestData.received_date).format(
        'YYYY-MM-DD'
      );
    }
    try {
      var data;
      if (params.ref_id && params.ref_id[0]) {
        data = await Promise.resolve(
          dispatch(repairsApi.endpoints.updateRepair.initiate(requestData))
        );
      } else {
        data = await Promise.resolve(
          dispatch(repairsApi.endpoints.addRepair.initiate(requestData))
        );
      }

      if (Object.prototype.hasOwnProperty.call(data, 'data')) {
        navigate.push('admin/tickets/repairs');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik<RepairFormType>({
    enableReinitialize: true,
    initialValues: {
      id: repair?.id,
      ticket: {
        id: repair?.ticket.id,
        ref_id: params.ref_id ? params.ref_id[0] : undefined,
        kind: 'repair',
        title: repair?.ticket.title ?? '',
        description: repair?.ticket.description ?? '',
        flight: undefined,
        severity: repair?.ticket.severity
          ? repair.ticket.severity.id?.toString()
          : undefined,
        status: repair?.ticket.status
          ? repair.ticket.status.id?.toString()
          : undefined,
        owner: repair?.ticket.owner
          ? repair.ticket.owner.id?.toString()
          : undefined,
        witness: repair?.ticket.witness
          ? repair.ticket.witness.id?.toString()
          : undefined,
      },
      issued_date: repair?.issued_date ?? undefined,
      received_date: repair?.received_date ?? undefined,
      pir_form_no: repair?.pir_form_no ?? '',
    },
    validate: toFormikValidate(repairFormSchema),
    onSubmit,
  });

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="General Information">
        <div className="flex flex-col mb-2">
          <TextField
            id="title"
            type="text"
            label="Title"
            className="flex-1"
            required
            {...formik.getFieldProps('ticket.title')}
          />
          {!!formik.errors.ticket?.title && (
            <div className="text-red-500 text-sm">
              {formik.errors.ticket.title}
            </div>
          )}
        </div>
        <div className="flex flex-col mb-2">
          <TextField
            id="description"
            type="text"
            label="Description"
            className="flex-1 mb-2"
            isMulti
            {...formik.getFieldProps('ticket.description')}
          />
          {!!formik.errors.ticket?.description && (
            <div className="text-red-500 text-sm">
              {formik.errors.ticket?.description}
            </div>
          )}
        </div>
        <div className="flex flex-col mb-2">
          <TextField
            id="pir_form_no"
            type="text"
            label="PIR Form no"
            className="flex-1 mb-2"
            isMulti
            {...formik.getFieldProps('pir_form_no')}
          />
          {!!formik.errors.pir_form_no && (
            <div className="text-red-500 text-sm">
              {formik.errors.pir_form_no}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          {allFlights && (
            <Selector
              id="flight_selector"
              defaultValue={
                repair?.ticket.flight
                  ? {
                      value: repair.ticket.flight.id!.toString(),
                      label: repair.ticket.flight.title,
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
              placeholder="Select flight"
              className="flex-1 mb-2"
              onChange={formik.setFieldValue}
              name="ticket.flight"
            />
          )}
        </div>
      </FormGroup>
      <FormGroup title="Time Frames">
        <div className="flex flex-col mb-2">
          <DateSelector
            id="issued_date"
            label="Issued Date"
            {...formik.getFieldProps('issued_date')}
            onChange={(issued_date) => {
              formik.setFieldValue('issued_date', issued_date);
            }}
          />
        </div>
        <div className="flex flex-col mb-2">
          <DateSelector
            id="received_date"
            label="Received Date"
            {...formik.getFieldProps('received_date')}
            onChange={(received_date) => {
              formik.setFieldValue('received_date', received_date);
            }}
          />
        </div>
      </FormGroup>
      <FormGroup title="States">
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          {allSeverities && (
            <Selector
              id="severity_selector"
              defaultValue={
                repair?.ticket.severity
                  ? {
                      value: repair.ticket.severity.id!.toString(),
                      label: repair.ticket.severity.name,
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
              placeholder="Select severity"
              className="flex-1 mb-2"
              onChange={formik.setFieldValue}
              name="ticket.severity"
              required
            ></Selector>
          )}
          {allStatus && (
            <Selector
              id="status_selector"
              defaultValue={
                repair?.ticket.status
                  ? {
                      value: repair.ticket.status.id!.toString(),
                      label: repair.ticket.status.title,
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
              placeholder="Select status"
              className="flex-1 mb-2"
              onChange={formik.setFieldValue}
              name="ticket.status"
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
                repair?.ticket.owner
                  ? {
                      value: repair.ticket.owner.id!.toString(),
                      label:
                        repair.ticket.owner.username ??
                        repair.ticket.owner.email ??
                        '--',
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
              name="ticket.owner"
            ></Selector>
          )}
          {allUsers && (
            <Selector
              id="witness_selector"
              defaultValue={
                repair?.ticket.witness
                  ? {
                      value: repair.ticket.witness.id!.toString(),
                      label:
                        repair.ticket.witness.username ??
                        repair.ticket.witness.email ??
                        '--',
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
              name="ticket.witness"
            ></Selector>
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
          type="link"
          href="/admin/tickets/repairs"
        />
      </div>
    </FormCard>
  );
}
