'use client';

import RepairDetailComponent from '../../../../(components)/RepairDetailComponent';

export default function RepairsDetailSegment({
  params,
}: {
  params: { ref_id?: string };
}) {
  return (
    <>
      <div className="w-2 bg-whiteShade"></div>
      <div className="flex-[2] lg:flex-[2] 2xl:flex-[4] overflow-y-auto h-full custom-scrollbar">
        {params.ref_id ? (
          <RepairDetailComponent ref_id={params.ref_id} />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
