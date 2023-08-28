import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import surveyApi from '@/modules/survey/surveyApi';
import {
  SurveyFeedbackType,
  SurveyParticipantsType,
} from '@/modules/survey/surveyTypes';
import { useEffect, useState } from 'react';

interface FeedbackTabProps {
  surveyUser: SurveyParticipantsType;
}

const FeedbackTab = (props: FeedbackTabProps) => {
  const dispatch = useAppDispatch();
  const [positives, setPositives] = useState<SurveyFeedbackType[]>([]);
  const [negatives, setNegatives] = useState<SurveyFeedbackType[]>([]);
  const [recommendations, setRecommendations] = useState<SurveyFeedbackType[]>(
    []
  );

  useEffect(() => {
    if (!props.surveyUser?.id) {
      return;
    }
    dispatch(
      surveyApi.endpoints.getSurveyUserFeedbacks.initiate({
        surveyUserId: props.surveyUser.id.toString(),
      })
    );
  }, [dispatch, props.surveyUser?.id]);

  const feedbacksData = useGetApiResponse<SurveyFeedbackType[]>(
    `getSurveyUserFeedbacks`
  );

  useEffect(() => {
    if (!feedbacksData) {
      return;
    }
    setPositives(
      feedbacksData.filter((feedback) => feedback.kind == 'positive')
    );
    setNegatives(
      feedbacksData.filter((feedback) => feedback.kind == 'negative')
    );
    setRecommendations(
      feedbacksData.filter((feedback) => feedback.kind == 'recommendation')
    );
  }, [dispatch, props.surveyUser?.id, feedbacksData]);

  for (let index = 1; index < 101; index++) {
    console.log(`row-span-`);
  }

  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div
        className="bg-blueWhite border border-primaryGray-300 rounded-lg max-w-5xl overflow-hidden"
        key={1}
      >
        <div className="grid grid-rows-3 md:grid-rows-none md:grid-cols-3">
          <div className="border-r border-primaryGray-300 grid grid-cols-2 md:block md:grid-cols-none">
            <div
              className={`bg-white p-2 border-b border-primaryGray-300 row-span-${positives.length} md:row-span-1`}
              style={{
                gridRow: `span ${positives.length} / span ${positives.length}`,
              }}
            >
              Positive Aspects
            </div>
            {positives.length > 0 ? (
              positives.map((feedback) => {
                return (
                  <div
                    className="text-sm p-2 border-b border-primaryGray-300"
                    key={feedback.id}
                  >
                    {feedback.text}
                  </div>
                );
              })
            ) : (
              <div className="text-sm p-2 border-primaryGray-300 text-primaryGray-500">
                No Feedbacks
              </div>
            )}
          </div>
          <div className="border-r border-primaryGray-300 grid grid-cols-2 md:block md:grid-cols-none">
            <div
              className={`bg-white p-2 border-b border-primaryGray-300 md:row-span-1`}
              style={{
                gridRow: `span ${negatives.length} / span ${negatives.length}`,
              }}
            >
              Negative Aspects
            </div>
            {negatives.length > 0 ? (
              negatives.map((feedback) => {
                return (
                  <div
                    className="text-sm p-2 border-b border-primaryGray-300"
                    key={feedback.id}
                  >
                    {feedback.text}
                  </div>
                );
              })
            ) : (
              <div className="text-sm p-2 border-primaryGray-300 text-primaryGray-500">
                No Feedbacks
              </div>
            )}
          </div>
          <div className="border-r border-primaryGray-300 grid grid-cols-2 md:block md:grid-cols-none">
            <div
              className={`bg-white p-2 border-b border-primaryGray-300 md:row-span-1`}
              style={{
                gridRow: `span ${recommendations.length} / span ${recommendations.length}`,
              }}
            >
              Recommendation
            </div>
            {recommendations.length > 0 ? (
              recommendations.map((feedback) => {
                return (
                  <div
                    className="text-sm p-2 border-b border-primaryGray-300"
                    key={feedback.id}
                  >
                    {feedback.text}
                  </div>
                );
              })
            ) : (
              <div className="text-sm p-2 border-primaryGray-300 text-primaryGray-500">
                No Feedbacks
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FeedbackTab;
