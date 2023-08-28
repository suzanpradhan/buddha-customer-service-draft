import { Button, PageBar } from '@/core/ui/zenbuddha/src';
import { AddSquare } from 'iconsax-react';

export default function AllRolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">Access Roles</div>
        }
      >
        <div className="flex">
          <Button
            text="New Role"
            className="h-8"
            type="link"
            href="/admin/access/roles/each"
            prefix={<AddSquare size={18} variant="Bold" className="mr-1" />}
          />
        </div>
      </PageBar>
      {children}
    </div>
  );
}
