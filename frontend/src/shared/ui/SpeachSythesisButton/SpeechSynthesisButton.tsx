import { IconButton } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

interface SpeechSynthesisButtonProps {
  width: number;
  height: number;
  utterance: string;
}
export const SpeechSynthesisButton = (props: SpeechSynthesisButtonProps) => {
  const { width, height, utterance } = props;
  return (
    <IconButton
      onClick={() => {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(utterance));
      }}
    >
      <PlayCircleIcon
        sx={{
          width: `${width}px`,
          height: `${height}px`
        }}
      />
    </IconButton>
  );
};
