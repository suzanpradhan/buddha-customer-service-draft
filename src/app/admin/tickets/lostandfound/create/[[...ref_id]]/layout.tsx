import { PageBar } from '@/core/ui/zenbuddha/src';

export default function CreateReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            Create Lost and Found
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
