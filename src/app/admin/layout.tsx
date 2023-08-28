'use client';
import { useAppDispatch, useAppSelector } from '@/core/redux/clientStore';
import { RootState } from '@/core/redux/store';
/* eslint-disable @next/next/no-img-element */

import {
  AppBar,
  SideBarNavGroup,
  SideBarNavLink,
} from '@/core/ui/zenbuddha/src';
import rolesApi from '@/modules/access_management/data/accessManagementApi';
import { PermissionType } from '@/modules/access_management/data/accessManagementType';
import statusApi from '@/modules/status/data/statusApi';
import { Logout, NotificationBing } from 'iconsax-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toggle, setToggle] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(statusApi.endpoints.getAllStatusForReports.initiate());
    dispatch(rolesApi.endpoints.getAllUserPermissions.initiate());
  }, [dispatch]);

  const userPermissionsData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllUserPermissions`]?.data as PermissionType[]
  );

  return (
    <div className="relative overflow-hidden">
      <AppBar
        onSideBarToggle={() => {
          setToggle(!toggle);
        }}
        leading={
          <Link href="/">
            <img
              src="/logo/logo_white.png"
              alt="buddha_air_logo_white"
              className="object-contain w-[130px]"
            />
          </Link>
        }
      >
        <button className="w-9 h-9 bg-accentBlue-400 rounded-md flex items-center justify-center">
          <NotificationBing className="text-white" variant="Bold" size={20} />
        </button>
        <button
          className="w-9 h-9 bg-accentBlue-400 rounded-md flex items-center justify-center"
          onClick={() => {
            signOut({ callbackUrl: '/login', redirect: true });
          }}
        >
          <Logout className="text-white" />
        </button>
      </AppBar>
      <div className="min-h-[calc(100vh-3.25rem)] gap-2 overflow-hidden">
        <div
          className={
            `bg-white min-w-[15rem] flex flex-col px-2 py-4 left-0 absolute top-[3.25rem] h-[calc(100vh-3.25rem)] overflow-y-auto custom-scrollbar ` +
            (toggle ? '' : '')
          }
        >
          <SideBarNavLink title="Dashboard" link="/admin/dashboard" />
          {userPermissionsData?.find(
            (permission) => permission.codename == 'view_ticket'
          ) ? (
            <SideBarNavGroup title="Tickets" segment="admin/tickets">
              {userPermissionsData?.find(
                (permission) => permission.codename == 'access_reports_ticket'
              ) ? (
                <SideBarNavLink title="Reports" link="/admin/tickets/reports" />
              ) : (
                <></>
              )}
              {userPermissionsData?.find(
                (permission) => permission.codename == 'access_complains_ticket'
              ) ? (
                <SideBarNavLink
                  title="Complains"
                  link="/admin/tickets/complains"
                />
              ) : (
                <></>
              )}
              {userPermissionsData?.find(
                (permission) =>
                  permission.codename == 'access_lost_and_found_ticket'
              ) ? (
                <SideBarNavLink
                  title="Lost and Found"
                  link="/admin/tickets/lostandfound"
                />
              ) : (
                <></>
              )}
              {userPermissionsData?.find(
                (permission) =>
                  permission.codename == 'access_lost_and_found_ticket'
              ) ? (
                <SideBarNavLink
                  title="Baggage Repairs"
                  link="/admin/tickets/repairs"
                />
              ) : (
                <></>
              )}

              {/* <SideBarNavLink title="Investigations" link="/investigations" /> */}
            </SideBarNavGroup>
          ) : (
            <></>
          )}
          {userPermissionsData?.find((permission) =>
            ['view_survey', 'view_spotcheck'].includes(
              permission.codename ?? ''
            )
          ) ? (
            <SideBarNavGroup title="Survey" segment="admin/surveys">
              {userPermissionsData?.find(
                (permission) => permission.codename == 'view_status'
              ) ? (
                <SideBarNavLink title="Surveys" link="/admin/surveys" />
              ) : (
                <></>
              )}
              <SideBarNavLink title="Spot Checks" link="/admin/spotchecks" />
            </SideBarNavGroup>
          ) : (
            <></>
          )}
          <div className="text-sm font-medium text-primaryGray-500 border-t my-2"></div>
          {userPermissionsData?.find(
            (permission) => permission.codename == 'view_user'
          ) ? (
            <SideBarNavGroup title="Accounts" segment="admin/accounts">
              {/* <SideBarNavLink title="Add New User" link="/accounts/users/new" /> */}
              <SideBarNavLink
                title="All Users"
                link="/admin/accounts/users/all"
              />
            </SideBarNavGroup>
          ) : (
            <></>
          )}

          {/* <SideBarNavGroup title="Access Management" segment="access">
            <SideBarNavLink title="User Roles" link="/access/roles" linkExact />
            <SideBarNavLink
              title="Add New Roles"
              link="/access/roles/each"
              linkExact
            />
          </SideBarNavGroup> */}
          {userPermissionsData?.find((permission) =>
            [
              'view_flight',
              'view_station',
              'view_status',
              'view_severity',
              'view_department',
              'view_source',
            ].includes(permission.codename ?? '')
          ) ? (
            <SideBarNavGroup title="General" segment="admin/settings">
              {userPermissionsData?.find(
                (permission) => permission.codename == 'view_flight'
              ) ? (
                <SideBarNavLink
                  title="Flights"
                  link="/admin/settings/flights"
                />
              ) : (
                <></>
              )}
              {userPermissionsData?.find(
                (permission) => permission.codename == 'view_severity'
              ) ? (
                <SideBarNavLink
                  title="Severities"
                  link="/admin/settings/severities"
                />
              ) : (
                <></>
              )}
              {userPermissionsData?.find(
                (permission) => permission.codename == 'view_station'
              ) ? (
                <SideBarNavLink
                  title="Stations"
                  link="/admin/settings/stations"
                />
              ) : (
                <></>
              )}
              {userPermissionsData?.find(
                (permission) => permission.codename == 'view_status'
              ) ? (
                <SideBarNavLink title="Status" link="/admin/settings/status" />
              ) : (
                <></>
              )}
              {userPermissionsData?.find(
                (permission) => permission.codename == 'view_source'
              ) ? (
                <SideBarNavLink
                  title="Sources"
                  link="/admin/settings/sources"
                />
              ) : (
                <></>
              )}
              {userPermissionsData?.find(
                (permission) => permission.codename == 'view_department'
              ) ? (
                <SideBarNavLink
                  title="Departments"
                  link="/admin/settings/departments"
                />
              ) : (
                <></>
              )}
            </SideBarNavGroup>
          ) : (
            <></>
          )}
        </div>
        <div
          className={
            `bg-white flex-1 transition duration-200 ease-in-out absolute top-[3.25rem] w-[calc(100%-15.5rem)] max-lg:w-full h-[calc(100vh-3.25rem)] left-[15.5rem] overflow-y-auto custom-scrollbar ` +
            (toggle ? 'max-lg:-translate-x-[15.5rem]' : '')
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
