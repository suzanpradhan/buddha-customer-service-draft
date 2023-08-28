/* eslint-disable @next/next/no-img-element */
'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { SelectorDataType } from '@/core/types/selectorTypes';
import AlertDialog from '@/core/ui/components/AlertDialog';
import PaginationNav from '@/core/ui/components/Pagination';
import Selector from '@/core/ui/components/Selector';
import {
  Button,
  FormCard,
  FormGroup,
  TableCard,
  TextField,
  tableStyles,
} from '@/core/ui/zenbuddha/src';
import accountApi from '@/modules/accounts/data/accountApi';
import flightApi from '@/modules/flights/data/flightApi';
import { FlightDetailType } from '@/modules/flights/data/flightTypes';
import stationApi from '@/modules/station/data/stationApi';
import { StationDetailType } from '@/modules/station/data/stationTypes';
import surveyApi from '@/modules/survey/surveyApi';
import {
  SurveyDetailType,
  SurveyMultipleParticipantType,
  SurveyParticipantCreateFormType,
  SurveyParticipantsType,
  surveyMultipleParticipantSchema,
  surveyParticipantCreateFormSchema,
} from '@/modules/survey/surveyTypes';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';
import ParticipantResultCard from './ParticipantsResultCard';

interface SurveyParticipantsProps {
  participants?: PaginatedResponseType<SurveyParticipantsType>;
  survey: SurveyDetailType;
}

const ParticipantsTab = (props: SurveyParticipantsProps) => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [modalIsOpen, setIsModelOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);
  const [showParticipantForm, toggleParticipantForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addingMultipleParticipants, setAddingMultipleParticipants] =
    useState(false);

  useEffect(() => {
    dispatch(flightApi.endpoints.getAllFlights.initiate(''));
    dispatch(stationApi.endpoints.getAllStations.initiate(''));
  }, [dispatch]);

  const allFlights = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllFlights`]?.data as FlightDetailType[]
  );

  const allStations = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllStations`]?.data as StationDetailType[]
  );

  const onSubmit = async (values: SurveyParticipantCreateFormType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      if (values.id != null) {
        await Promise.resolve(
          dispatch(
            surveyApi.endpoints.updateSurveyParticipant.initiate({
              ...values,
            })
          )
        );
      } else {
        await Promise.resolve(
          dispatch(
            surveyApi.endpoints.addSurveyParticipant.initiate({
              ...values,
            })
          )
        );
      }

      toggleParticipantForm(false);
    } catch (error) {
      console.log(error);
    }
    formik.resetForm();
    setIsLoading(false);
  };

  const onAddParticipantsSubmit = async (
    values: SurveyMultipleParticipantType
  ) => {
    var requestData: SurveyMultipleParticipantType = {
      survey_ref_id: values.survey_ref_id,
      profiles: values.profiles?.map(
        (each) => (each as SelectorDataType).value
      ),
    };

    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      await Promise.resolve(
        dispatch(
          surveyApi.endpoints.addBulkSurveyParticipants.initiate(requestData)
        )
      );
    } catch (error) {
      console.log(error);
    }
    addParticipantsFormik.resetForm();
    setIsLoading(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      survey: props.survey?.ref_id!,
      full_name: '',
      address: '',
      phone: '',
      flight: undefined,
      station: undefined,
    },
    validate: toFormikValidate(surveyParticipantCreateFormSchema),
    onSubmit,
  });

  const addParticipantsFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      survey_ref_id: props.survey.ref_id!,
      profiles: [],
    },
    validate: toFormikValidate(surveyMultipleParticipantSchema),
    onSubmit: onAddParticipantsSubmit,
  });

  const openEditForm = (participant: SurveyParticipantsType) => {
    formik.setValues({
      id: participant.id,
      survey: props.survey?.ref_id!,
      full_name: participant?.profile?.full_name ?? '',
      address: participant?.profile?.address ?? '',
      phone: participant?.profile?.phone ?? '',
      flight: participant?.flight?.id
        ? participant?.flight?.id.toString()
        : undefined,
      station: participant?.station?.id
        ? participant?.station?.id.toString()
        : undefined,
    });
    toggleParticipantForm(true);
  };

  const getProfilesSelectorData = async (inputValue: string) => {
    const data = await Promise.resolve(
      dispatch(
        accountApi.endpoints.getProfiles.initiate({
          search: inputValue,
          surveyRefId: props.survey.ref_id,
        })
      )
    );
    if (data.data) {
      return data.data.results.map((profile) => {
        return {
          value: profile.id!.toString(),
          label: profile.full_name,
          extra: profile.is_staff ? 'Staff' : 'Customer',
        } as SelectorDataType;
      });
    }
  };

  const participantsLoadOptions = (inputValue: string) => {
    return Promise.resolve(getProfilesSelectorData(inputValue));
  };

  const formatOptionLabel = (props: SelectorDataType) => {
    return (
      <div className="flex gap-2 items-center">
        <div className="flex-1">{props.label}</div>
        <div className="text-xs text-primaryGray-500">
          {props.extra ? 'Staff' : 'Customer'}
        </div>
      </div>
    );
  };

  console.log(formik.values);

  return (
    <>
      <AlertDialog
        isOpen={modalIsOpen}
        deleteContent={onDelete?.title}
        onClickNo={() => {
          setIsModelOpen(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(
                surveyApi.endpoints.deleteSurveyParticipant.initiate(onDelete)
              )
            );
          }
          setIsModelOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="m-4 flex flex-col gap-4 max-w-5xl">
        <form
          className="flex flex-col items-end"
          onSubmit={addParticipantsFormik.handleSubmit}
        >
          <Selector
            id="add_multiple_participants"
            options={[]}
            loadOptions={participantsLoadOptions}
            type="Async"
            isMulti
            placeholder="Search Participants"
            className="flex-1 mb-2 w-full"
            onChange={(field: string, value: any) => {
              addParticipantsFormik.setFieldValue(field, value);
              if (value && value.length > 0) {
                setAddingMultipleParticipants(true);
              } else {
                setAddingMultipleParticipants(false);
              }
            }}
            formatOptionLabel={formatOptionLabel}
            suffix={
              addingMultipleParticipants ? (
                <Button
                  text="Add Participants"
                  className={`h-8 w-fit mx-2`}
                  type="submit"
                  isLoading={isLoading}
                />
              ) : (
                <Button
                  text="New Participant"
                  className={`h-8 w-fit mx-2`}
                  type="button"
                  onClick={() => {
                    toggleParticipantForm(true);
                  }}
                />
              )
            }
            name="profiles"
          ></Selector>
        </form>
        {showParticipantForm ? (
          <FormCard onSubmit={formik.handleSubmit}>
            <FormGroup title="Participant Information">
              <div className="flex flex-col mb-2">
                <TextField
                  id="full_name"
                  type="text"
                  label="Full name"
                  className="flex-1"
                  {...formik.getFieldProps('full_name')}
                />
                {!!formik.errors.full_name && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.full_name}
                  </div>
                )}
              </div>
              <div className="flex flex-col mb-2">
                <TextField
                  id="phone"
                  type="text"
                  label="Phone"
                  className="flex-1"
                  {...formik.getFieldProps('phone')}
                />
                {!!formik.errors.phone && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.phone}
                  </div>
                )}
              </div>
              <div className="flex flex-col mb-2">
                <TextField
                  id="address"
                  type="text"
                  label="Address"
                  className="flex-1"
                  {...formik.getFieldProps('address')}
                />
                {!!formik.errors.address && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.address}
                  </div>
                )}
              </div>
            </FormGroup>
            <FormGroup title="Others">
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
                  type="Select"
                  label="Flight"
                  placeholder="Select flight"
                  className="flex-1 mb-2"
                  onChange={formik.setFieldValue}
                  name="flight"
                  value={
                    formik.values?.flight
                      ? allFlights
                          ?.filter(
                            (flight) => flight.id == formik.values.flight
                          )
                          .map(
                            (flight) =>
                              ({
                                value: flight.id!.toString(),
                                label: flight.title,
                              } as SelectorDataType)
                          )[0]
                      : undefined
                  }
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
                  type="Select"
                  placeholder="Select station"
                  className="flex-1 mb-2"
                  onChange={formik.setFieldValue}
                  name="station"
                  value={
                    formik.values?.station
                      ? allStations
                          ?.filter(
                            (station) => station.id == formik.values.station
                          )
                          .map(
                            (station) =>
                              ({
                                value: station.id!.toString(),
                                label: station.name,
                              } as SelectorDataType)
                          )[0]
                      : undefined
                  }
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
                  toggleParticipantForm(false);
                  formik.resetForm();
                }}
              />
            </div>
          </FormCard>
        ) : (
          <></>
        )}

        <TableCard
          footer={
            props.participants && props.participants.results.length > 0 ? (
              <PaginationNav
                gotoPage={setPageIndex}
                canPreviousPage={pageIndex > 0}
                canNextPage={
                  pageIndex < props.participants.pagination.total_page - 1
                }
                pageCount={props.participants.pagination.total_page}
                pageIndex={props.participants.pagination.current_page - 1}
              />
            ) : (
              <></>
            )
          }
        >
          <thead>
            <tr className={tableStyles.table_thead_tr}>
              <th className={tableStyles.table_th}>Participant</th>
              <th className={tableStyles.table_th}>Flight</th>
              <th className={tableStyles.table_th}>Station</th>
              <th className={tableStyles.table_th + ` w-44`}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {props.participants?.results.map(
              (participant: SurveyParticipantsType, index) => {
                return (
                  <ParticipantResultCard
                    key={participant.id ?? '' + index}
                    onDelete={() => {
                      setOnDelete(participant.id);
                      setIsModelOpen(true);
                    }}
                    onEdit={() => {
                      openEditForm(participant);
                    }}
                    participant={participant}
                    survey={props.survey}
                  />
                );
              }
            )}
          </tbody>
        </TableCard>
      </div>
    </>
  );
};
export default ParticipantsTab;
