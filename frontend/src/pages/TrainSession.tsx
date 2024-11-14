import { useGetSynonyms } from '@entities/TrainSession/model/useGetSynonims';
import { Loader } from '@shared/ui';

export const TrainSession: React.FC = () => {
  // const { isSessionLoading, sessionData } = useGetTrainSession();
  const { isLoading, data } = useGetSynonyms('cat');

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
