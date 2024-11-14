import LinearProgress from '@mui/material/LinearProgress';
import { keyframes } from '@mui/system';
import { useEffect, useState } from 'react';

const pulseAnimation = keyframes`
  0% { opacity: 1; transform: scaleX(1); }
  50% { opacity: 0.6; transform: scaleX(1.05); }
  100% { opacity: 1; transform: scaleX(1); }
`;

const INTERVAL_TIME = 200;

export const Loader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 75 ? prev + 10 : prev));
      setBufferProgress((prev) => (prev < 100 ? prev + 15 : prev));
    }, INTERVAL_TIME);

    return () => clearInterval(timer);
  }, []);

  return (
    <LinearProgress
      variant="buffer"
      value={progress}
      valueBuffer={bufferProgress}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        '& .MuiLinearProgress-bar': {
          backgroundColor: '#8a2be2'
        },
        '& .MuiLinearProgress-bar2Buffer': {
          backgroundColor: '#8a2be2',
          animation: bufferProgress === 100 ? `${pulseAnimation} 1.5s ease-in-out infinite` : 'none',
          transformOrigin: 'left'
        }
      }}
    />
  );
};
