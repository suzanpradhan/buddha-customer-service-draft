import { PageBar } from '@/core/ui/zenbuddha/src';

export default function AddNewUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">Add New User</div>
        }
      ></PageBar>
      {children}
    </div>
  );
}
