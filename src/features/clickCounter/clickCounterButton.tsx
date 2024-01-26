import { useSelector, useDispatch } from 'react-redux';
import { checkPermission, reset } from './clickCounterSlice';
import { AppDispatch, RootState } from '@/app/store';

export const ClickCounterButton = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const status = useSelector((state: RootState) => state.counter.status);
  const dispatch: AppDispatch = useDispatch();

  return (
    <div>
      <div>Count: {count}</div>
      {status === 'loading' && <div>Loading...</div>}
      <button onClick={() => dispatch(checkPermission())}>Increment if Allowed</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
};
