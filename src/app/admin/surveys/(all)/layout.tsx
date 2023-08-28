import { Button, PageBar } from '@/core/ui/zenbuddha/src';
import { AddSquare } from 'iconsax-react';

export default function SpotCheckListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">Survey</div>
        }
      >
        <div className="flex">
          <Button
            text="New Survey"
            className="h-8"
            href="/admin/surveys/mutate"
            type="link"
            prefix={<AddSquare size={18} variant="Bold" className="mr-1" />}
          />
        </div>
      </PageBar>
      {children}
    </div>
  );
}
