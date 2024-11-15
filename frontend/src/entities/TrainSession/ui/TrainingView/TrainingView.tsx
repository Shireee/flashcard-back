import { Container, Typography } from '@mui/material';
import { TrainingControls } from '../TrainingControls';
import { Flashcard } from '@shared/api/models/common';
import { useUpdateRepeatNumber } from '@entities/TrainSession/model/useUpdateNumber';

interface TrainingViewInterface {
  trainingSession: Flashcard;
}

export const TrainingView: React.FC<TrainingViewInterface> = ({ trainingSession }) => {
  const { id, Img, item, itemReveal } = trainingSession;

  const { mutate: updateRepeatNumber } = useUpdateRepeatNumber();

  const handleMemorize = () => {
    updateRepeatNumber(id);
  };

  const handleRepeat = () => {
    console.log(id);
  };

  return (
    <Container>
      <img width={100} height={100} src={Img} alt="no-seo" />
      <Typography>{item}</Typography>
      <Typography>{itemReveal}</Typography>
      <TrainingControls handleMemorize={handleMemorize} handleRepeat={handleRepeat} />
    </Container>
  );
};
