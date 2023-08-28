import { SurveyDetailType } from '@/modules/survey/surveyTypes';

const DetailTab = ({ survey }: { survey: SurveyDetailType }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div className="text-base">Description</div>
      <div className="text-sm mt-2">{survey.description ?? 'No Summary'}</div>
    </div>
  );
};
export default DetailTab;
