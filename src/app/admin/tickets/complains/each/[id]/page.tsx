'use client';

import EachDetailComponent from '../../(components)/EachDetailComponent';

export default function ReportDetailPage({
  params,
}: {
  params: { id?: string };
}) {
  return params.id ? <EachDetailComponent id={params.id} /> : <></>;
}

// 'use client';

// import { useAppDispatch } from '@/core/redux/clientStore';
// import { Button, PageBar } from '@/core/ui/zenbuddha/src';
// import { setSideViewToggle } from '@/modules/sideview/redux/sideViewSlice';
// import { FiEdit3, FiTrash2, FiX } from 'react-icons/fi';
// import { RiArrowDropDownLine } from 'react-icons/ri';

// export default function NewReportPage({ params }: { params: { id?: string } }) {
//   const dispatch = useAppDispatch();
//   return (
//     <div className="flex flex-col">
//       <PageBar
//         leading={
//           <div className="flex flex-col pt-6 pb-4">
//             <div className="text-sm font-medium text-primaryGray-500">
//               Report #4B08LD
//             </div>
//             <div className="text-base font-bold text-dark-500">
//               Wrong Bus Number
//             </div>
//             <div className="text-sm font-normal text-primaryGray-500">
//               20-Sept-2022
//             </div>
//           </div>
//         }
//         bottom={
//           <div className="flex gap-4 text-base font-normal text-primaryGray-500 pb-2">
//             <button className="text-dark-500 font-semibold relative">
//               Details
//               <div className="absolute top-[calc(100%+6px)] h-[2px] w-full bg-dark-500 rounded-md"></div>
//             </button>
//             <button>Investigation</button>
//             <button>Attachments</button>
//             <button>Resolutions</button>
//           </div>
//         }
//       >
//         <div className="flex gap-2">
//           <Button
//             className="w-9 h-9"
//             buttonType="bordered"
//             prefix={<FiTrash2 size={20} />}
//           />
//           <Button
//             className="w-9 h-9"
//             buttonType="bordered"
//             prefix={<FiEdit3 size={20} />}
//           />
//           <div className="flex-none relative">
//             <Button
//               className="h-9"
//               buttonType="bordered"
//               text="Open"
//               onClick={() => {
//                 dispatch(setSideViewToggle(false));
//               }}
//               suffix={<RiArrowDropDownLine size={18} />}
//             />
//             <div
//               id="options"
//               className="hidden w-48 py-2 mt-2 bg-white rounded-lg shadow-xl absolute"
//             >
//               <a
//                 href="#"
//                 className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
//               >
//                 Item 1
//               </a>
//               <a
//                 href="#"
//                 className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
//               >
//                 Item 2
//               </a>
//               <a
//                 href="#"
//                 className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
//               >
//                 Item 3
//               </a>
//             </div>
//           </div>
//           <Button
//             className="w-9 h-9"
//             buttonType="bordered"
//             type="button"
//             onClick={() => {
//               dispatch(setSideViewToggle(false));
//             }}
//             suffix={<FiX size={20} />}
//           />
//         </div>
//       </PageBar>
//     </div>
//   );
// }
