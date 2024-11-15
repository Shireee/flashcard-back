import { TrainingBar, TrainingView, useGetTrainingSession } from '@entities/TrainSession';
import { Container } from '@mui/material';
import { Loader } from '@shared/ui';

export const TrainingSession: React.FC = () => {
  const { data: trainingSessionData, isLoading: trainingSessionIsLoading } = useGetTrainingSession();

  return trainingSessionIsLoading ? (
    <Loader />
  ) : (
    trainingSessionData && (
      <Container>
        <TrainingBar sessionLength={trainingSessionData.sessionLength} />
        <TrainingView trainingSession={trainingSessionData.content[0]} />
      </Container>
    )
  );
};
