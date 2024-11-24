import React from 'react';
import { Box } from '@mui/material';

interface TrainingBarProps {
  sessionLength: number;
  currentIndex: number;
}

export const TrainingBar: React.FC<TrainingBarProps> = (props) => {
  const { sessionLength, currentIndex } = props;
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        paddingBottom: '16px',
        columnGap: '4px'
      }}
    >
      {Array.from({ length: sessionLength }).map((_, index) => (
        <Box
          key={index}
          sx={{
            width: '100%',
            height: '4px',
            borderRadius: '4px',
            backgroundColor: index < currentIndex ? 'green' : 'gray'
          }}
        />
      ))}
    </Box>
  );
};
