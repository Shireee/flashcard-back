import { backendClient } from '@shared/api';
import { TrainSessionModel } from '../models/trainSession';

export const TrainSessionService = {
  getTrainSession: async () => {
    return await backendClient.get<TrainSessionModel>('/getTrainSession');
  }
};
