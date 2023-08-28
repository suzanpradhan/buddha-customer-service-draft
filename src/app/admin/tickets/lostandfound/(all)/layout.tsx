'use client';

import { usePathname } from 'next/navigation';

export interface TicketListingLayoutProps {
  view?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
}

export default function TicketListingLayout(props: TicketListingLayoutProps) {
  const pathName = usePathname();

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 max-h-[calc(100vh-3.25rem)]">
        {props.children}
      </div>
      {!pathName.endsWith('lostandfound') ? props.view : <></>}
    </div>
  );
}
