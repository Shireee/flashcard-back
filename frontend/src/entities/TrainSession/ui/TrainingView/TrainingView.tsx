import { Accordion, AccordionDetails, AccordionSummary, Box, Container, IconButton, Typography } from '@mui/material';
import { TrainingControls } from '../TrainingControls';
import { Flashcard } from '@shared/api/models/common';
import { useUpdateRepeatNumber } from '@entities/TrainSession/model/useUpdateNumber';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SpeechSynthesisButton } from '@shared/ui';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface TrainingViewInterface {
  trainingSession: Flashcard;
}

export const TrainingView: React.FC<TrainingViewInterface> = ({ trainingSession }) => {
  const { id, Img, item, itemReveal, examples } = trainingSession;
  const [isRevealed, setIsRevealed] = useState(false);

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          columnGap: '30px',
          alignItems: 'center'
        }}
      >
        <Typography>{item}</Typography>
        <SpeechSynthesisButton utterance={item} />
      </Box>
      {isRevealed ? (
        <>
          <Typography>{itemReveal}</Typography>
          {examples.map((example) => {
            return (
              <Accordion>
                <AccordionSummary
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }
                  }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography>{example.item}</Typography>
                  <SpeechSynthesisButton utterance={example.item} />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{example.itemReveal}</Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
          <TrainingControls handleMemorize={handleMemorize} handleRepeat={handleRepeat} />
        </>
      ) : (
        <IconButton onClick={() => setIsRevealed(true)}>
          <VisibilityIcon />
        </IconButton>
      )}
    </Container>
  );
};
