import { SpotCheckDetailType } from '@/modules/spotcheck/spotcheckTypes';

const DetailTab = ({ spotcheck }: { spotcheck: SpotCheckDetailType }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div className="text-base">Description</div>
      <div className="text-sm mt-2">
        {spotcheck.description ?? 'No Summary'}
      </div>
    </div>
  );
};
export default DetailTab;
