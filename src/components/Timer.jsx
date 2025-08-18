// Timer.jsx
import { useState, useEffect } from "react";

export default function Timer({
  minutes = 10,
  pesananId,
  onFinish,
  onProgress,
}) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (!pesananId) return;

    const storageKey = `pesanan_${pesananId}_endTime`;
    let endTime = localStorage.getItem(storageKey);

    if (!endTime) {
      endTime = Date.now() + minutes * 60 * 1000;
      localStorage.setItem(storageKey, endTime);
    }

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((Number(endTime) - now) / 1000));
      setTimeLeft(diff);

      const totalTime = minutes * 60;
      const progress = 100 - (diff / totalTime) * 100;
      if (onProgress) {
        onProgress(progress);
      }

      if (diff <= 0) {
        if (onFinish) {
          onFinish();
        } 
      }
    };

    const interval = setInterval(tick, 1000);

    tick();

    return () => clearInterval(interval);
  }, [minutes, pesananId, onFinish, onProgress]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <span className="font-semibold">
         {mins.toString().padStart(2, "0")}:
      {secs.toString().padStart(2, "0")} 
    </span>
  );
}
