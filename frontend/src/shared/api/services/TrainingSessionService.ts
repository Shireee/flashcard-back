import { backendClient } from '@shared/api';
import { TrainingSessionModel } from '../models/trainingSession';

export const TrainingSessionService = {
  getTrainingSession: async () => {
    return await backendClient.get<TrainingSessionModel>('/training/getTraingSession');
  }
};