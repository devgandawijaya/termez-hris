import React from 'react';
import { useCounterViewModel } from '../viewmodels/useCounterViewModel';

export default function CounterView() {
  const { count, increment } = useCounterViewModel();
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onClick={increment}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        count is {count}
      </button>
    </div>
  );
}
