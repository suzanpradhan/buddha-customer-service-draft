import { useGetApiResponse } from '@/core/api/getApiResponse';
import { Button, tableStyles } from '@/core/ui/zenbuddha/src';
import {
  SpotCheckAttributeType,
  SpotCheckMarkType,
  SpotCheckRatingType,
} from '@/modules/spotcheck/spotcheckTypes';
import { Eye } from 'iconsax-react';
import { useState } from 'react';

interface StaffRatingCardProps {
  staffRating: SpotCheckRatingType;
}

const StaffRatingCard = (props: StaffRatingCardProps) => {
  const [showDetail, toggleShowDetail] = useState(false);

  const allSpotChecksAttributes = useGetApiResponse<SpotCheckAttributeType[]>(
    'getSpotChecksAttributeList'
  );

  return (
    <>
      <tr className={tableStyles.table_tbody_tr}>
        <td className={tableStyles.table_td}>
          <div className="flex items-center gap-1">
            {/* <div className="border w-10 h-10 border-primaryGray-300 rounded-md mr-2 flex justify-center items-center bg-white">
              <img
                src={
                  props.staffRating.user.profile?.avatar
                    ? apiPaths.serverUrl +
                      props.staffRating.user.profile?.avatar
                    : '/images/avatar.jpg'
                }
                alt="avatar"
                className="object-cover w-8 h-8 rounded-full"
              />
            </div> */}
            <div className="flex flex-col justify-center h-10">
              <div className="font-medium text-sm">
                {props.staffRating.user.profile?.full_name ??
                  props.staffRating.user.username}
              </div>
              <div className="text-xs text-primaryGray-500">
                {props.staffRating.user.profile?.phone ??
                  props.staffRating.user.email}
              </div>
            </div>
          </div>
        </td>
        <td
          className={
            tableStyles.table_td +
            ` flex items-center justify-end h-16 gap-2 w-36`
          }
        >
          <Button
            className="h-8 w-8"
            // href={`/admin/surveys/each/${props.survey.ref_id}/participants/${participant.id}`}
            prefix={<Eye size={18} variant="Bold" />}
            kind="secondary"
            type="button"
            onClick={() => {
              toggleShowDetail(!showDetail);
            }}
          />
          {/* <Button
            className="h-8 w-8"
            prefix={<Edit2 size={18} variant="Bold" />}
            kind="default"
            type="button"
          />
          <Button
            className="h-8 w-8"
            prefix={<Trash size={18} variant="Bold" />}
            kind="danger"
            type="button"
          /> */}
        </td>
      </tr>
      {showDetail && props.staffRating.marks && allSpotChecksAttributes ? (
        <tr>
          <td colSpan={2}>
            <div className="bg-blueWhite border border-primaryGray-300 rounded-lg overflow-hidden">
              <div
                className={
                  `h-fit grid md:grid-rows-none ` +
                  (props.staffRating.marks
                    ? `grid-rows-${props.staffRating.marks.length + 1} `
                    : '') +
                  (props.staffRating.marks
                    ? `md:grid-cols-${props.staffRating.marks.length + 1} `
                    : '')
                }
              >
                {props.staffRating.marks?.map((mark: SpotCheckMarkType) => {
                  return (
                    <div
                      className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2 border-r border-primaryGray-300"
                      key={mark.id + '_' + mark.spot_check_attribute}
                    >
                      <div className="bg-white p-2 border-b border-primaryGray-300">
                        {
                          allSpotChecksAttributes.filter(
                            (spotCheckAttribute) =>
                              spotCheckAttribute.id?.toString() ==
                              mark.spot_check_attribute
                          )[0].title
                        }
                      </div>
                      <div className="text-md p-2 border-b border-primaryGray-300">
                        {mark.mark}
                      </div>
                    </div>
                  );
                })}
                <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2 border-r border-primaryGray-300">
                  <div className="bg-white p-2 border-b border-primaryGray-300">
                    Improvement
                  </div>
                  <div className="text-sm p-2 border-b border-primaryGray-300">
                    {props.staffRating.improvement}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      ) : (
        <></>
      )}
    </>
  );
};
export default StaffRatingCard;
