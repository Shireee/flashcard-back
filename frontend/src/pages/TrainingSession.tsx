import { useUpdateRepeatNumber } from '@entities/TrainSession/model/useUpdateNumber';

export const TrainingSession: React.FC = () => {
  const { mutate: updateRepeatNumber, isLoading, isError } = useUpdateRepeatNumber();

  const handleUpdate = (id: number) => {
    updateRepeatNumber(id);
  };

  return (
    <div>
      <button onClick={() => handleUpdate(1731680498898)} disabled={isLoading}>
        Update Repeat Number
      </button>
      {isError && <p>Failed to update repeat number.</p>}
    </div>
  );
};
