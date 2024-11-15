import { IconButton } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

interface SpeechSynthesisButtonProps {
  utterance: string;
}
export const SpeechSynthesisButton = (props: SpeechSynthesisButtonProps) => {
  const { utterance } = props;
  return (
    <IconButton
      onClick={() => {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(utterance));
      }}
    >
      <PlayCircleIcon />
    </IconButton>
  );
};
