'use client';

import EachDetailComponent from '../../../../(components)/EachDetailComponent';

export default function ReportDetailSegment({
  params,
}: {
  params: { id?: string };
}) {
  return (
    <>
      <div className="w-2 bg-whiteShade"></div>
      <div className="flex-[2] lg:flex-[2] 2xl:flex-[4] overflow-y-auto h-full custom-scrollbar">
        {params.id ? <EachDetailComponent id={params.id} /> : <></>}
      </div>
    </>
  );
}
