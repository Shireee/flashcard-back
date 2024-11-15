import { Flashcard } from '@shared/api/models/common';

export type TrainingSessionModel = {
  sessionLength: number;
  content: Flashcard[];
};
