import { useSelector } from 'react-redux';
import { RootState } from '@/_redux/store';
import {
  decrement,
  increment,
  incrementAsync,
} from '@/_redux/features/counter';
import { useAppDispatch } from '@/_redux/hooks';

export function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const status = useSelector((state: RootState) => state.counter.status);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <button
          aria-label='Increment value'
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <button
          aria-label='Increment value'
          onClick={() => dispatch(incrementAsync())}
        >
          Increment Async
        </button>
        {status === 'loading' ? 'loading' : <span>{count}</span>}
        <button
          aria-label='Decrement value'
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
