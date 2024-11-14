import { Flashcard } from '@shared/api/models/common';

export type TrainSessionModel = {
  sessionLength: number;
  content: Flashcard[];
};
