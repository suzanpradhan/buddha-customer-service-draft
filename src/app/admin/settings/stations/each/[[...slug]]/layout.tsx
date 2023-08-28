import { PageBar } from '@/core/ui/zenbuddha/src';

export default function AddNewStationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            Add New Station
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
