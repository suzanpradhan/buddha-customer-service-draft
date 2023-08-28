import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import { SelectorDataType } from '@/core/types/selectorTypes';
import Selector from '@/core/ui/components/Selector';
import {
  Button,
  FormCard,
  FormGroup,
  TextField,
} from '@/core/ui/zenbuddha/src';
import accountApi from '@/modules/accounts/data/accountApi';
import { AccountDetailType } from '@/modules/accounts/data/accountTypes';
import repairsApi from '@/modules/ticket/data/repairsApis';
import {
  CompensationDetailType,
  CompensationFormType,
  RepairDetailType,
  compensationFormSchema,
} from '@/modules/ticket/data/repairsTypes';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toFormikValidate } from 'zod-formik-adapter';

const RepairDetailTab = ({ repair }: { repair: RepairDetailType }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showCompensationForm, toggleCompensationForm] = useState(false);

  useEffect(() => {
    dispatch(
      repairsApi.endpoints.getRepairCompensation.initiate(repair.ticket.ref_id)
    );
  }, [dispatch, repair.ticket.ref_id]);

  useEffect(() => {
    dispatch(accountApi.endpoints.getAllUsers.initiate());
  }, [dispatch]);

  const allUsers = useGetApiResponse<AccountDetailType[]>(`getAllUsers`);

  const compensation = useGetApiResponse<CompensationDetailType>(
    `getRepairCompensation("${repair.ticket.ref_id!}")`
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

  useEffect(() => {
    if (!compensation?.id) {
      toggleCompensationForm(true);
      return;
    }
    return toggleCompensationForm(false);
  }, [compensation?.id]);

  const onSubmit = async (values: CompensationFormType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      dispatch(
        repairsApi.endpoints.addRepairCompensation.initiate({
          ...values,
        })
      );
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik<CompensationFormType>({
    enableReinitialize: true,
    initialValues: {
      ref_id: repair.ticket.ref_id.toString(),
    },
    validate: toFormikValidate(compensationFormSchema),
    onSubmit,
  });

  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div className="text-base">Details</div>
      <div className="text-sm mt-2">
        {repair.ticket.description ?? 'No Details'}
      </div>
      {compensation?.id ? (
        <>
          <div className="text-base mt-4">Compensation</div>
          <div className="bg-blueWhite border border-primaryGray-300 rounded-lg overflow-hidden mt-2">
            <div
              className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-3 `}
            >
              <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2 border-r border-primaryGray-300">
                <div className="bg-white p-2 border-b border-primaryGray-300">
                  Amount
                </div>
                <div className="text-sm p-2 border-b border-primaryGray-300">
                  Rs. {compensation.amount}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2 border-r border-primaryGray-300">
                <div className="bg-white p-2 border-b border-primaryGray-300">
                  Bill no.
                </div>
                <div className="text-sm p-2 border-b border-primaryGray-300">
                  {compensation.bill_no}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2 border-r border-primaryGray-300">
                <div className="bg-white p-2 border-b border-primaryGray-300">
                  Signed By
                </div>
                <div className="text-sm p-2 border-b border-primaryGray-300">
                  {compensation.signed_by ? (
                    <div className="flex flex-1 flex-col sm:flex-row mr-8">
                      <div className="flex flex-col justify-center h-fit">
                        <div className="font-medium text-sm whitespace-nowrap">
                          {!compensation.signed_by.profile?.full_name
                            ? compensation.signed_by.username
                            : `${compensation.signed_by.profile?.full_name}`}
                        </div>
                        <div className="text-xs text-primaryGray-500">
                          {compensation.signed_by.profile?.phone ??
                            compensation.signed_by.email}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {showCompensationForm ? (
        <FormCard onSubmit={formik.handleSubmit} className="mt-4">
          <FormGroup title="Compensation">
            <div className="flex flex-col mb-2">
              <TextField
                id="amount"
                type="number"
                label="Amount"
                className="flex-1"
                required
                {...formik.getFieldProps('amount')}
              />
              {!!formik.errors.amount && (
                <div className="text-red-500 text-sm">
                  {formik.errors.amount}
                </div>
              )}
            </div>
            <div className="flex flex-col mb-2">
              <TextField
                id="bill_no"
                type="string"
                label="Bill no."
                className="flex-1"
                required
                {...formik.getFieldProps('bill_no')}
              />
              {!!formik.errors.bill_no && (
                <div className="text-red-500 text-sm">
                  {formik.errors.bill_no}
                </div>
              )}
            </div>
            <div className="flex flex-col mb-2">
              {allUsers && (
                <Selector
                  id="signed_by_selector"
                  options={allUsers?.map(
                    (user) =>
                      ({
                        value: user.username!.toString(),
                        label: user.username,
                        extra: user.profile?.avatar,
                      } as SelectorDataType)
                  )}
                  label="Signed by"
                  type="Select"
                  placeholder="Select staff"
                  className="flex-1 mb-2"
                  formatOptionLabel={formatOptionLabel}
                  onChange={formik.setFieldValue}
                  name="signed_by"
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
              onClick={() => {
                toggleCompensationForm(false);
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
export default RepairDetailTab;
