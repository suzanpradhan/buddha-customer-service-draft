'use client';

import EachDetailComponent from '../../(components)/EachDetailComponent';

export default function ReportDetailPage({
  params,
}: {
  params: { id?: string };
}) {
  return params.id ? <EachDetailComponent id={params.id} /> : <></>;
}
