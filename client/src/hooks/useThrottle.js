import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to throttle a state value.
 * @param {*} value - The value to throttle.
 * @param {number} limit - The throttle limit in milliseconds.
 * @returns {*} The throttled value.
 */
export const useThrottle = (value, limit = 300) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value);
          lastRan.current = Date.now();
        }
      },
      limit - (Date.now() - lastRan.current)
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

export default useThrottle;
