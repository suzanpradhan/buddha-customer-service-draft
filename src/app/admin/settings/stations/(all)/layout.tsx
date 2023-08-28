'use client';

import { Button, PageBar } from '@/core/ui/zenbuddha/src';
import { useGetPermissions } from '@/core/utils/getPermission';
import { AddSquare } from 'iconsax-react';
export default function StationsListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPermissionsData = useGetPermissions();
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">Stations</div>
        }
      >
        {userPermissionsData?.find(
          (permission) => permission.codename == 'add_station'
        ) ? (
          <div className="flex">
            <Button
              text="New Station"
              className="h-8"
              type="link"
              href="/admin/settings/stations/each"
              prefix={<AddSquare size={18} variant="Bold" className="mr-1" />}
            />
          </div>
        ) : (
          <></>
        )}
      </PageBar>
      {children}
    </div>
  );
}
