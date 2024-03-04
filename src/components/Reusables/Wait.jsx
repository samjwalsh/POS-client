import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

export default function Wait() {
  const [dots, setDots] = useState(3);

  useInterval(() => {
    if (dots < 3) setDots(dots + 1);
    else setDots(0);
  }, 100);

  return (
    <div className='title cnter p-2 w-full bg-base-100'>
      Please wait {'.'.repeat(dots)}
    </div>
  );
}

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}
