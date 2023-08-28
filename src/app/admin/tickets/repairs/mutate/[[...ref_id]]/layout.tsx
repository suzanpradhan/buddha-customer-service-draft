import { PageBar } from '@/core/ui/zenbuddha/src';

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            Create Baggage Repair Report
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
