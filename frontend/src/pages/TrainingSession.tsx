import { useGetImages } from '@entities/TrainSession/model/useGetImages';
import { useGetSynonyms } from '@entities/TrainSession/model/useGetSynonims';
import { Loader } from '@shared/ui';

export const TrainingSession: React.FC = () => {
  // const { isSessionLoading, sessionData } = useGetTrainSession();
  const { isLoading, data } = useGetImages('cat');

  return isLoading ? (
    <Loader />
  ) : (
    data && (
      <>
        {data.map((word) => {
          return <p>{word}</p>;
        })}
      </>
    )
  );
};
