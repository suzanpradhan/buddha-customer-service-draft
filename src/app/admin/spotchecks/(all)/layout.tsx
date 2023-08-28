import { Button, PageBar } from '@/core/ui/zenbuddha/src';
import { AddSquare } from 'iconsax-react';

export default function SurveyListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">Spot Checks</div>
        }
      >
        <div className="flex">
          <Button
            text="New Spot Check"
            className="h-8"
            href="/admin/spotchecks/mutate"
            type="link"
            prefix={<AddSquare size={18} variant="Bold" className="mr-1" />}
          />
        </div>
      </PageBar>
      {children}
    </div>
  );
}
