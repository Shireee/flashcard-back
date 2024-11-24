import { TrainingBar, TrainingView, useGetTrainingSession } from '@entities/TrainSession';
import { Container, Typography } from '@mui/material';
import { TrainingSessionModel } from '@shared/api/models/trainingSession';
import { Loader } from '@shared/ui';
import { useState, useEffect } from 'react';

export const TrainingSession: React.FC = () => {
  // MEMORIZED STATE PROPS TO BAR
  const { data: initialTrainingSessionData, isLoading: trainingSessionIsLoading } = useGetTrainingSession();
  const [trainingSessionData, setTrainingSessionData] = useState<TrainingSessionModel | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [memorizedCount, setMemorizedCount] = useState(0);

  useEffect(() => {
    if (initialTrainingSessionData?.sessionLength !== 0) setTrainingSessionData(initialTrainingSessionData);
  }, [trainingSessionIsLoading]);

  const handleNext = (repeat = false) => {
    if (!trainingSessionData) return;

    const updatedContent = [...trainingSessionData.content];
    if (repeat) updatedContent.push(updatedContent[currentIndex]);
    else setMemorizedCount((preveMmorizedCount) => preveMmorizedCount + 1);

    if (currentIndex < updatedContent.length - 1) setCurrentIndex((prevIndex) => prevIndex + 1);

    setTrainingSessionData({ ...trainingSessionData, content: updatedContent });
  };

  return trainingSessionIsLoading ? (
    <Loader />
  ) : trainingSessionData ? (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        height: '100%'
      }}
    >
      <TrainingBar currentIndex={memorizedCount} sessionLength={trainingSessionData.sessionLength} />
      <TrainingView trainingSession={trainingSessionData.content[currentIndex]} handleNext={handleNext} />
    </Container>
  ) : (
    <Typography sx={{ padding: '16px' }} variant="h4">
      No trainingSessionData
    </Typography>
  );
};
