import { useState, useEffect, useMemo } from "react"; 

export default function Timer({ minutes, onFinish, onProgress, orderId }) {
  const storageKey = useMemo(() => `order_end_time_${orderId}`, [orderId]);
  const finishedKey = useMemo(() => `order_finished_${orderId}`, [orderId]);

  const getInitialTimeLeft = () => {
    const savedEndTime = localStorage.getItem(storageKey);
    const isFinished = localStorage.getItem(finishedKey);

    if (isFinished === "true") {
      return 0;
    }

    if (savedEndTime) {
      const remaining = Math.floor((savedEndTime - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return minutes * 60;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft);

  useEffect(() => {
    if (!orderId) return;

    const isFinished = localStorage.getItem(finishedKey);
    if (isFinished === "true") {
      setTimeLeft(0);
      onFinish?.();
      return;
    }

    let savedEndTime = localStorage.getItem(storageKey);
    if (!savedEndTime) {
      const newEndTime = Date.now() + minutes * 60 * 1000;
      localStorage.setItem(storageKey, newEndTime);
      savedEndTime = newEndTime;
    }

    const interval = setInterval(() => {
      const remaining = Math.floor((savedEndTime - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        onFinish?.();
        localStorage.removeItem(storageKey);
        localStorage.setItem(finishedKey, "true");
      } else {
        setTimeLeft(remaining);
        if (onProgress) {
          const totalDuration = minutes * 60;
          const progress = ((totalDuration - remaining) / totalDuration) * 100;
          onProgress(progress);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, onFinish, onProgress, orderId, storageKey, finishedKey]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <span className="font-semibold">
      {mins}:{secs.toString().padStart(2, "0")}
    </span>
  );
}
