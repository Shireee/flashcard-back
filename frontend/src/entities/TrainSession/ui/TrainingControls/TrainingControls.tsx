import { Button, ButtonGroup } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface TrainingControlsProps {
  handleMemorize: () => void;
  handleRepeat: () => void;
}
export const TrainingControls = (props: TrainingControlsProps) => {
  const { handleMemorize, handleRepeat } = props;

  return (
    <ButtonGroup>
      <Button startIcon={<KeyboardArrowLeftIcon />} onClick={handleMemorize}>
        I've memorized
      </Button>
      <Button endIcon={<KeyboardArrowRightIcon />} onClick={handleRepeat}>
        Show this word again
      </Button>
    </ButtonGroup>
  );
};
