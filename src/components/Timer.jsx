import { useState, useEffect } from "react";

export default function Timer({ durationInSeconds, onFinish, onProgress }) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);

  useEffect(() => {
    setTimeLeft(durationInSeconds);
  }, [durationInSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish?.();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (onProgress && durationInSeconds > 0) {
          const progress =
            ((durationInSeconds - newTime) / durationInSeconds) * 100;
          onProgress(Math.min(100, progress)); 
        }

        if (newTime <= 0) {
          clearInterval(intervalId);
          onFinish?.();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, durationInSeconds, onFinish, onProgress]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <span className="font-semibold">
      {mins}:{secs.toString().padStart(2, "0")}
    </span>
  );
}
