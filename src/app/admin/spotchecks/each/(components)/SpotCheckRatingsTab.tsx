/* eslint-disable @next/next/no-img-element */
'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { PaginatedResponseType } from '@/core/types/reponseTypes';
import { SelectorDataType } from '@/core/types/selectorTypes';
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
import { AccountDetailType } from '@/modules/accounts/data/accountTypes';
import spotCheckApi from '@/modules/spotcheck/spotcheckApi';
import {
  SpotCheckAttributeType,
  SpotCheckDetailType,
  SpotCheckRatingFormType,
  SpotCheckRatingType,
  spotCheckRatingFormSchema,
} from '@/modules/spotcheck/spotcheckTypes';
import stationApi from '@/modules/station/data/stationApi';
import { StationDetailType } from '@/modules/station/data/stationTypes';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';
import StaffRatingCard from './StaffRatingCard';

interface SpotCheckRatingsProps {
  spotCheck: SpotCheckDetailType;
  // participants?: PaginatedResponseType<SurveyParticipantsType>;
  // survey: SurveyDetailType;
}

const SpotCheckRatingsTab = (props: SpotCheckRatingsProps) => {
  const dispatch = useAppDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [showStaffRatingForm, toggleStaffRatingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(stationApi.endpoints.getAllStations.initiate(''));
    dispatch(accountApi.endpoints.getAllUsers.initiate());
    dispatch(spotCheckApi.endpoints.getSpotChecksAttributeList.initiate());
    if (props.spotCheck.ref_id) {
      dispatch(
        spotCheckApi.endpoints.getPaginatedStaffRatingList.initiate({
          page: pageIndex + 1,
          ref_id: props.spotCheck.ref_id,
        })
      );
    }
  }, [dispatch]);

  const spotChecksStaffRatingListPaginatedData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getPaginatedStaffRatingList`]
        ?.data as PaginatedResponseType<SpotCheckRatingType>
  );

  const allStations = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllStations`]?.data as StationDetailType[]
  );

  const allUsers = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllUsers`]?.data as AccountDetailType[]
  );

  const allSpotChecksAttributes = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getSpotChecksAttributeList`]
        ?.data as SpotCheckAttributeType[]
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

  const onSubmit = async (values: SpotCheckRatingFormType) => {
    console.log(values);

    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      await Promise.resolve(
        dispatch(
          spotCheckApi.endpoints.addSpotCheckStaffRating.initiate({
            ...values,
          })
        )
      );
      toggleStaffRatingForm(false);
    } catch (error) {
      console.log(error);
    }
    formik.resetForm();
    setIsLoading(false);
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      spot_check: props.spotCheck.id,
      user: '',
      ratings_marks: allSpotChecksAttributes
        ? allSpotChecksAttributes.map((spotCheckAttribute) => ({
            spot_check_attribute: spotCheckAttribute.id,
            mark: '0',
          }))
        : undefined,
      improvement: '',
    },
    validate: toFormikValidate(spotCheckRatingFormSchema),
    onSubmit,
  });

  return (
    <div className="m-4 flex flex-col gap-4 max-w-5xl">
      {showStaffRatingForm ? (
        <></>
      ) : (
        <div className="max-w-5xl flex justify-end">
          <Button
            text="Add New Staff Rating"
            className={`h-8 w-fit`}
            type="button"
            onClick={() => {
              toggleStaffRatingForm(true);
            }}
          />
        </div>
      )}
      {showStaffRatingForm ? (
        <FormCard onSubmit={formik.handleSubmit}>
          <FormGroup title="Staff">
            {allUsers && (
              <Selector
                id="user_selector"
                options={allUsers?.map(
                  (user) =>
                    ({
                      value: user.id!.toString(),
                      label: user.username,
                      extra: user.profile?.avatar,
                    } as SelectorDataType)
                )}
                formatOptionLabel={formatOptionLabel}
                placeholder="Select or create staff"
                className="flex-1 mb-2"
                onChange={formik.setFieldValue}
                name="user"
              ></Selector>
            )}
          </FormGroup>
          <FormGroup title="Ratings">
            {formik.values.ratings_marks &&
              formik.values.ratings_marks.map((ratings_mark, index) => {
                return (
                  <div
                    className="flex flex-row mb-2 w-full items-center"
                    key={ratings_mark.spot_check_attribute}
                  >
                    <div className="text-base flex-1">
                      {
                        allSpotChecksAttributes.filter(
                          (allSpotChecksAttribute) =>
                            allSpotChecksAttribute.id ==
                            ratings_mark.spot_check_attribute
                        )[0].title
                      }
                    </div>
                    <div className="w-24">
                      <TextField
                        id={`ratings_marks.[${index}].mark`}
                        type="number"
                        className="flex-1"
                        {...formik.getFieldProps(
                          `ratings_marks.[${index}].mark`
                        )}
                      />
                      {!!formik.errors.ratings_marks &&
                        !!formik.errors.ratings_marks[index] && (
                          <div className="text-red-500 text-sm">
                            {formik.errors.ratings_marks[index]}
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
          </FormGroup>

          <FormGroup title="Improvement">
            <div className="flex flex-col mb-2">
              <TextField
                id="improvement"
                type="text"
                isMulti
                rows={5}
                className="flex-1"
                {...formik.getFieldProps('improvement')}
              />
              {!!formik.errors.improvement && (
                <div className="text-red-500 text-sm">
                  {formik.errors.improvement}
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
                toggleStaffRatingForm(false);
              }}
            />
          </div>
        </FormCard>
      ) : (
        <></>
      )}

      <TableCard
        footer={
          spotChecksStaffRatingListPaginatedData &&
          spotChecksStaffRatingListPaginatedData.results ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={
                pageIndex <
                spotChecksStaffRatingListPaginatedData.pagination.total_page - 1
              }
              pageCount={
                spotChecksStaffRatingListPaginatedData.pagination.total_page
              }
              pageIndex={
                spotChecksStaffRatingListPaginatedData.pagination.current_page -
                1
              }
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>STAFFS</th>
            <th className={tableStyles.table_th + ` w-36`}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {spotChecksStaffRatingListPaginatedData?.results.map(
            (staffRating: SpotCheckRatingType, index) => {
              return <StaffRatingCard staffRating={staffRating} key={index} />;
            }
          )}
        </tbody>
      </TableCard>
    </div>
  );
};
export default SpotCheckRatingsTab;
function toggleParticipantForm(arg0: boolean) {
  throw new Error('Function not implemented.');
}
