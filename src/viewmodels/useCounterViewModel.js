import { useState } from 'react';
import CounterModel from '../models/CounterModel';

// view‑model hook that bridges model and view
export function useCounterViewModel() {
  const [model] = useState(() => new CounterModel());
  const [count, setCount] = useState(model.count);

  const increment = () => {
    model.increment();
    setCount(model.count);
  };

  return { count, increment };
}
