import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import { Button, tableStyles } from '@/core/ui/zenbuddha/src';
import surveyApi from '@/modules/survey/surveyApi';
import {
  SurveyDetailType,
  SurveyFeedbackType,
  SurveyParticipantsType,
  SurveyQuestionnaireAttemptDetailType,
} from '@/modules/survey/surveyTypes';
import { Copy, Edit2, Eye, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface ParticipantResultCardProps {
  participant: SurveyParticipantsType;
  survey: SurveyDetailType;
  onEdit: () => void;
  onDelete: () => void;
}

const FeedbacksCard = (props: { participantId: string }) => {
  const dispatch = useAppDispatch();
  const [positives, setPositives] = useState<SurveyFeedbackType[]>([]);
  const [negatives, setNegatives] = useState<SurveyFeedbackType[]>([]);
  const [recommendations, setRecommendations] = useState<SurveyFeedbackType[]>(
    []
  );

  useEffect(() => {
    if (!props.participantId) {
      return;
    }
    dispatch(
      surveyApi.endpoints.getSurveyUserFeedbacks.initiate({
        surveyUserId: props.participantId.toString(),
      })
    );
  }, [dispatch, props.participantId]);

  const feedbacksData = useGetApiResponse<SurveyFeedbackType[]>(
    `getSurveyUserFeedbacks:${props.participantId}`
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
  }, [props.participantId, feedbacksData]);

  return (
    <tr>
      <td colSpan={4}>
        <div
          className="bg-blueWhite border border-primaryGray-300 rounded-lg w-full overflow-hidden"
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
      </td>
    </tr>
  );
};

const QuestionairesResponseCard = (props: { participantId: string }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!props.participantId) {
      return;
    }
    dispatch(
      surveyApi.endpoints.getSurveyUserQuestionResponses.initiate({
        surveyUserId: props.participantId.toString(),
      })
    );
  }, [dispatch, props.participantId]);

  const questionnaireAttemptData =
    useGetApiResponse<SurveyQuestionnaireAttemptDetailType>(
      `getSurveyUserQuestionResponses:${props.participantId}`
    );

  return (
    <tr>
      <td colSpan={4}>
        <div
          className="bg-blueWhite border border-primaryGray-300 rounded-lg w-full overflow-hidden"
          key={1}
        >
          <div className="border-r border-primaryGray-300 grid grid-cols-none">
            {questionnaireAttemptData?.question_attempts.map(
              (questionAttempt) => (
                <>
                  <div
                    className={`bg-white text-sm p-2 border-b border-primaryGray-300`}
                  >
                    {questionAttempt.question?.question ?? '--'}
                  </div>
                  <div className="text-sm p-2 border-b border-primaryGray-300">
                    {questionAttempt.answers[0]
                      ? questionAttempt.answers[0].value
                      : '--'}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

const ParticipantResultCard = (props: ParticipantResultCardProps) => {
  const [showDetail, toggleShowDetail] = useState(false);

  const handleSurveyCopyLink = (id: string) => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL}/survey/${id}`
    );
    toast.success('Survey link copied to clipboard.');
  };

  const handleSurveyFeedbackCopyLink = (id: string) => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL}/survey/${id}/feedback`
    );
    toast.success('Feedback link copied to clipboard.');
  };

  return (
    <>
      <tr className={tableStyles.table_tbody_tr}>
        <td className={tableStyles.table_td}>
          <div className="flex items-center gap-1">
            <div className="flex flex-col justify-center h-fit">
              <div className="font-medium text-sm">
                {props.participant.profile?.full_name}
              </div>
              <div className="text-xs text-primaryGray-500">
                {props.participant.profile?.mobile}
              </div>
            </div>
          </div>
        </td>
        <td className={tableStyles.table_td}>
          {props.participant.flight?.title}
        </td>
        <td className={tableStyles.table_td}>
          {props.participant.station?.name}
        </td>
        <td
          className={
            tableStyles.table_td +
            ` flex items-center justify-end gap-2 w-56 h-16`
          }
        >
          {props.participant.is_submitted ? (
            <Button
              className="h-8 w-8"
              prefix={<Eye size={18} variant="Bold" />}
              kind="secondary"
              type="button"
              onClick={() => {
                toggleShowDetail(!showDetail);
              }}
            />
          ) : (
            <></>
          )}
          {props.survey.kind == 'questions' ? (
            <Button
              className="h-8 w-8"
              prefix={<Copy size={18} variant="Bold" />}
              buttonType="bordered"
              type="button"
              tooltip="Copy Survey Link"
              onClick={() => {
                handleSurveyCopyLink(props.participant.id ?? '');
              }}
            />
          ) : props.survey.kind == 'evaluation' ? (
            <Button
              className="h-8 w-8"
              prefix={<Copy size={18} variant="Bold" />}
              buttonType="bordered"
              type="button"
              tooltip="Copy Feedback Survey Link"
              onClick={() => {
                handleSurveyFeedbackCopyLink(props.participant.id ?? '');
              }}
            />
          ) : (
            <></>
          )}

          <Button
            className="h-8 w-8"
            prefix={<Edit2 size={18} variant="Bold" />}
            kind="default"
            type="button"
            onClick={props.onEdit}
            // openEditForm(participant);
          />
          <Button
            className="h-8 w-8"
            prefix={<Trash size={18} variant="Bold" />}
            kind="danger"
            type="button"
            onClick={props.onDelete}
          />
        </td>
      </tr>
      {showDetail && props.participant.is_submitted ? (
        props.survey.kind == 'evaluation' ? (
          <FeedbacksCard participantId={props.participant.id!.toString()} />
        ) : props.survey.kind == 'questions' ? (
          <QuestionairesResponseCard
            participantId={props.participant.id!.toString()}
          />
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </>
  );
};
export default ParticipantResultCard;
