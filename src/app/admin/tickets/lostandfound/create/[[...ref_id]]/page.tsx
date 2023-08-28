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
import severityApi from '@/modules/severities/data/severityApi';
import { SeverityDetailType } from '@/modules/severities/data/severityTypes';
import sourceApi from '@/modules/source/source/sourceApi';
import stationApi from '@/modules/station/data/stationApi';
import statusApi from '@/modules/status/data/statusApi';
import { StatusDetailType } from '@/modules/status/data/statusTypes';
import lostandfoundApi from '@/modules/ticket/data/lostandfoundApi';
import {
  LostAndFoundDetailType,
  LostAndFoundFormType,
  LostAndFoundRequestType,
  ProductDetailType,
  lostandFoundFormSchema,
} from '@/modules/ticket/data/lostandfoundTypes';
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
      dispatch(
        lostandfoundApi.endpoints.getLostAndFound.initiate(params.ref_id[0])
      );
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
    dispatch(lostandfoundApi.endpoints.getAllProducts.initiate(''));
    dispatch(statusApi.endpoints.getAllStatusForLostAndFound.initiate());
    dispatch(accountApi.endpoints.getAllUsers.initiate());
  }, [dispatch]);

  const lostAndFound = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[
        `getLostAndFound("${params.ref_id ? params.ref_id[0] : undefined}")`
      ]?.data as LostAndFoundDetailType
  );

  const allSeverities = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllSeverities`]?.data as SeverityDetailType[]
  );
  const allProducts = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllProducts`]?.data as ProductDetailType[]
  );
  const allStatus = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllStatusForLostAndFound`]
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

  const allKinds = [
    { label: 'Lost', value: 'lost' },
    { label: 'Found', value: 'found' },
  ];

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

  const onSubmit = async ({ files, ...values }: LostAndFoundFormType) => {
    var requestData: LostAndFoundRequestType = {
      ...values,
      products: values.products?.map((each) =>
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
            lostandfoundApi.endpoints.updateLostAndFound.initiate({
              ref_id: params.ref_id[0],
              ...requestData,
            })
          )
        );
      } else {
        data = await Promise.resolve(
          dispatch(
            lostandfoundApi.endpoints.addLostAndFound.initiate(requestData)
          )
        );
      }

      if (files && Object.prototype.hasOwnProperty.call(data, 'data')) {
        await Promise.resolve(
          dispatch(
            attachmentApi.endpoints.uploadAttachments.initiate({
              ref_id: ((data as any).data as LostAndFoundDetailType).ref_id,
              files: files,
            })
          )
        );
      }
      if (data) {
        navigate.push('admin/tickets/lostandfound');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: lostAndFound?.title ?? '',
      description: lostAndFound?.description ?? '',
      sources:
        lostAndFound?.sources?.map(
          (source) =>
            ({
              value: source.id!.toString(),
              label: source.name,
            } as SelectorDataType)
        ) ?? [],
      products:
        lostAndFound?.products?.map(
          (product) =>
            ({
              value: product.id!.toString(),
              label: product.name,
            } as SelectorDataType)
        ) ?? [],
      assignee: lostAndFound?.assignee
        ? lostAndFound.assignee.id?.toString()
        : undefined,
      kind: lostAndFound?.kind ? lostAndFound.kind : 'lost',
      severity: lostAndFound?.severity
        ? lostAndFound.severity.id?.toString()
        : undefined,
      status: lostAndFound?.status
        ? lostAndFound.status.id?.toString()
        : undefined,
      owner: lostAndFound?.owner
        ? lostAndFound.owner.id?.toString()
        : undefined,
      witness: lostAndFound?.witness
        ? lostAndFound.witness.id?.toString()
        : undefined,
      files: undefined,
    },
    validate: toFormikValidate(lostandFoundFormSchema),
    onSubmit,
  });

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Lost & Found Information">
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
        <div className="flex flex-col mb-2">
          <Selector
            defaultValue={
              lostAndFound?.kind
                ? allKinds.filter((kind) => kind.value == lostAndFound.kind)[0]
                : allKinds[0]
            }
            id="kind_selector"
            options={allKinds}
            type="Select"
            label="Lost or Found"
            placeholder="Select kind"
            className="flex-1"
            onChange={formik.setFieldValue}
            name="kind"
          />
        </div>
        {/* <div className="flex flex-col sm:flex-row gap-2 mb-2">
          {allFlights && (
            <Selector
              id="flight_selector"
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
        </div> */}
        <div className="flex flex-col mb-2">
          {allProducts && (
            <Selector
              id="product_selector"
              options={allProducts?.map(
                (product) =>
                  ({
                    value: product.id!.toString(),
                    label: product.name,
                  } as SelectorDataType)
              )}
              label="Products"
              isMulti
              type="Creatable"
              placeholder="Select or create products"
              className="flex-1"
              onChange={formik.setFieldValue}
              name="products"
              value={formik.values.products}
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
                lostAndFound?.severity
                  ? {
                      value: lostAndFound.severity.id!.toString(),
                      label: lostAndFound.severity.name,
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
                lostAndFound?.status
                  ? {
                      value: lostAndFound.status.id!.toString(),
                      label: lostAndFound.status.title,
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
                lostAndFound?.owner
                  ? {
                      value: lostAndFound.owner.id!.toString(),
                      label:
                        lostAndFound.owner.username ??
                        lostAndFound.owner.email ??
                        '--',
                      extra: lostAndFound.owner.profile?.avatar,
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
                lostAndFound?.witness
                  ? {
                      value: lostAndFound.witness.id!.toString(),
                      label:
                        lostAndFound.witness.username ??
                        lostAndFound.witness.email ??
                        '--',
                      extra: lostAndFound.witness.profile?.avatar,
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
              lostAndFound?.assignee
                ? {
                    value: lostAndFound.assignee.id!.toString(),
                    label:
                      lostAndFound.assignee.username ??
                      lostAndFound.assignee.email ??
                      '--',
                    extra: lostAndFound.assignee.profile?.avatar,
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
