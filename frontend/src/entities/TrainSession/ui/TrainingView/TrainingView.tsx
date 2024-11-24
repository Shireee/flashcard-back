import { Accordion, AccordionDetails, AccordionSummary, Box, Container, IconButton, Typography } from '@mui/material';
import { TrainingControls } from '../TrainingControls';
import { Flashcard } from '@shared/api/models/common';
import { useUpdateRepeatNumber } from '@entities/TrainSession/model/useUpdateNumber';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SpeechSynthesisButton } from '@shared/ui';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styles from './TrainingView.module.scss';

interface TrainingViewInterface {
  trainingSession: Flashcard;
  handleNext: (repeat?: boolean) => void;
}

export const TrainingView: React.FC<TrainingViewInterface> = ({ trainingSession, handleNext }) => {
  const { id, Img, item, itemReveal, examples } = trainingSession;
  const [isRevealed, setIsRevealed] = useState(false);

  const { mutate: updateRepeatNumber } = useUpdateRepeatNumber();

  const handleMemorize = () => {
    setIsRevealed((prevIsRevealed) => !prevIsRevealed);
    updateRepeatNumber(id);

    handleNext();
  };

  const handleRepeat = () => {
    console.log(`Repeating item with id: ${id}`);
    setIsRevealed((prevIsRevealed) => !prevIsRevealed);
    handleNext(true);
  };

  return (
    <Container
      sx={{
        padding: '0px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <img className={styles.image} src={Img} />
      <Box
        sx={{
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          columnGap: '30px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h5" component="h1">
          {item}
        </Typography>
        <SpeechSynthesisButton width={40} height={40} utterance={item} />
      </Box>
      {isRevealed ? (
        <Box sx={{ marginBottom: 'auto' }}>
          <Typography
            sx={{
              marginBottom: '16px'
            }}
            variant="h5"
            component="h1"
          >
            {itemReveal}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '16px',
              overflowY: 'scroll',
              maxHeight: '380px'
            }}
          >
            {examples.map((example, index) => (
              <Accordion
                sx={{
                  '&::before': {
                    content: 'none'
                  },
                  borderRadius: '8px'
                }}
                key={index}
              >
                <AccordionSummary
                  sx={{
                    padding: '16px',
                    margin: 0,
                    '& .MuiAccordionSummary-content': {
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      '&.Mui-expanded': {
                        margin: '0px'
                      }
                    }
                  }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography>{example.item}</Typography>
                  <SpeechSynthesisButton utterance={example.item} width={30} height={30} />
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    padding: '16px',
                    borderTop: '1px solid #434343'
                  }}
                >
                  <Typography>{example.itemReveal}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '80px',
            marginBottom: 'auto',
            marginTop: '40px'
          }}
        >
          <IconButton
            sx={{ border: '1px solid gray', borderRadius: '8px', width: '80px', height: '80px' }}
            onClick={() => setIsRevealed(true)}
          >
            <VisibilityIcon sx={{ width: '40px', height: '40px' }} />
          </IconButton>
        </Box>
      )}
      <TrainingControls handleMemorize={handleMemorize} handleRepeat={handleRepeat} />
    </Container>
  );
};
