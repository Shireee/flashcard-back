import { TrainingBar, TrainingView, useGetTrainingSession } from '@entities/TrainSession';
import { Loader } from '@shared/ui';

export const TrainingSession: React.FC = () => {
  const { data: trainingSessionData, isLoading: trainingSessionIsLoading } = useGetTrainingSession();

  return trainingSessionIsLoading ? (
    <Loader />
  ) : (
    trainingSessionData && (
      <>
        <TrainingBar sessionLength={trainingSessionData.sessionLength} />
        <TrainingView trainingSession={trainingSessionData.content[0]} />
      </>
    )
  );
};
