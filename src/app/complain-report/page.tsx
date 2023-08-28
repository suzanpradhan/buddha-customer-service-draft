'use client';

import { assets } from '@/core/constants/uiConstants';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
import { SelectorDataType } from '@/core/types/selectorTypes';
import Selector from '@/core/ui/components/Selector';
import {
  AppBar,
  Button,
  FormCard,
  FormGroup,
  MultiUploader,
  TextField,
} from '@/core/ui/zenbuddha/src';
import flightApi from '@/modules/flights/data/flightApi';
import { FlightDetailType } from '@/modules/flights/data/flightTypes';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CustomerBaggageReportPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    dispatch(flightApi.endpoints.getAllFlights.initiate(''));
  }, [dispatch]);

  const allFlights = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllFlights`]?.data as FlightDetailType[]
  );

  const onSubmit = async (values: any) => {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      files: undefined,
    },
    onSubmit,
  });

  console.log(formik.values);

  return (
    <div className="flex flex-col items-center bg-whiteShade h-screen">
      <AppBar
        hasSideBar={false}
        leading={
          <Link href="/">
            <img
              src="/logo/logo_white.png"
              alt="buddha_air_logo_white"
              className="object-contain w-[150px]"
            />
          </Link>
        }
      ></AppBar>
      <div
        className={
          `w-full px-5 pb-5 from-accentBlue-500 via-accentBlue-500/60 to-accentBlue-500/0 bg-gradient-to-b flex flex-col items-center ` +
          'h-[80vh]'
        }
      >
        <div className="max-w-5xl w-full flex mt-9 relative">
          <div className="absolute max-w-5xl top-[calc(100%+1rem)] w-full m-auto flex flex-col">
            <div className="relative mb-4">
              <img
                src={assets.baggageReportBackground}
                alt="baggage_report_background_cover"
                className="rounded-xl h-52 sm:h-80 object-cover w-full object-left sm:object-center"
              />
              <div className="absolute rounded-xl top-0 h-full w-full from-accentBlue-500 via-accentBlue-500/60 to-white/10 bg-gradient-to-t"></div>
              <div className="top-0 p-4 flex flex-col justify-end absolute h-full">
                <h3 className="text-white font-bold text-2xl">
                  COMPLAIN REPORT
                </h3>
                <p className="text-blueWhite text-sm font-light mt-1">
                  Complete this form to offer feedback, recognize an employee,
                  make a baggage claim or file a complaint regarding your travel
                  experience.
                </p>
              </div>
            </div>

            <div className="flex flex-col bg-white rounded-xl mb-5">
              <FormCard onSubmit={formik.handleSubmit}>
                <FormGroup title="Authorization">
                  <div
                    className="flex flex-col mb-2"
                    key={'question_' + 'question.id'}
                  >
                    <div className="flex items-end">
                      <TextField
                        id="email"
                        type="email"
                        label="Email Address"
                        className="flex-1"
                        suffix={<Button text="Send OTP" className="h-8" />}
                      />
                    </div>
                  </div>
                </FormGroup>
                <FormGroup title="Report Information">
                  <div
                    className="flex flex-col mb-2"
                    key={'question_' + 'question.id'}
                  >
                    <TextField
                      id="title"
                      type="text"
                      label="Title"
                      placeholder=""
                      className="flex-1"
                    />
                  </div>
                  <div
                    className="flex flex-col mb-2"
                    key={'question_' + 'question.id'}
                  >
                    <TextField
                      id="description"
                      type="text"
                      label="Tell us summary of the report"
                      placeholder=""
                      isMulti
                      rows={5}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
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
                        placeholder="Select flight"
                        className="flex-1 mb-2"
                        onChange={formik.setFieldValue}
                        name="ticket.flight"
                      />
                    )}
                  </div>
                </FormGroup>
                <FormGroup title="My Information">
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <div className="flex flex-col flex-1">
                      <TextField
                        id="firstName"
                        type="text"
                        label="First name"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <TextField
                        id="lastName"
                        type="text"
                        label="Last name"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div
                    className="flex flex-col mb-2"
                    key={'question_' + 'question.id'}
                  >
                    <TextField
                      id="phone"
                      type="text"
                      label="Phone Number"
                      className="flex-1"
                    />
                  </div>
                  <div
                    className="flex flex-col mb-2"
                    key={'question_' + 'question.id'}
                  >
                    <TextField
                      id="address"
                      type="text"
                      label="Street Address"
                      className="flex-1"
                    />
                  </div>
                </FormGroup>
                <FormGroup title="Attachments">
                  <MultiUploader
                    name="files"
                    label="Attach any relevant documents or photos related to your baggage"
                    setFieldValue={formik.setFieldValue}
                    files={formik.values.files}
                  />
                </FormGroup>
                <div className="flex justify-end gap-2 m-4">
                  <Button text="Submit" className="h-8 w-fit" type="submit" />
                </div>
              </FormCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
