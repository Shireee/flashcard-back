import { TrainingBar, TrainingView, useGetTrainingSession } from '@entities/TrainSession';
import { Container } from '@mui/material';
import { Loader } from '@shared/ui';
import { useState, useEffect } from 'react';

export const TrainingSession: React.FC = () => {
  // MEMORIZED STATE PROPS TO BAR
  const { data: initialTrainingSessionData, isLoading: trainingSessionIsLoading } = useGetTrainingSession();
  const [trainingSessionData, setTrainingSessionData] = useState(initialTrainingSessionData);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Устанавливаем данные, как только они загружаются
    if (initialTrainingSessionData) {
      setTrainingSessionData(initialTrainingSessionData);
    }
  }, [initialTrainingSessionData]);

  const handleNext = (repeat = false) => {
    if (!trainingSessionData) return;

    const updatedContent = [...trainingSessionData.content];
    if (repeat) updatedContent.push(updatedContent[currentIndex]);

    // Если есть еще элементы, переключаемся на следующий
    if (currentIndex < updatedContent.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      alert('Training session completed');
    }

    // Обновляем данные тренировочной сессии
    setTrainingSessionData({ ...trainingSessionData, content: updatedContent });
  };

  return trainingSessionIsLoading ? (
    <Loader />
  ) : (
    trainingSessionData && (
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          height: '100%'
        }}
      >
        <TrainingBar currentIndex={currentIndex} sessionLength={trainingSessionData.sessionLength} />
        <TrainingView trainingSession={trainingSessionData.content[currentIndex]} handleNext={handleNext} />
      </Container>
    )
  );
};
