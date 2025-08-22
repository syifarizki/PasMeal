import { useState, useEffect } from "react";

export default function Timer({
  durationInSeconds,
  startTime,
  onFinish,
  onProgress,
}) {
  // Hitung waktu selesai = waktu mulai + durasi
  const endTime = startTime
    ? new Date(startTime).getTime() + durationInSeconds * 1000
    : Date.now() + durationInSeconds * 1000;

  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, Math.floor((endTime - Date.now()) / 1000))
  );

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish?.();
      return;
    }

    const intervalId = setInterval(() => {
      const newTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

      setTimeLeft(newTime);

      // progress bar (opsional)
      if (onProgress && durationInSeconds > 0) {
        const progress =
          ((durationInSeconds - newTime) / durationInSeconds) * 100;
        onProgress(Math.min(100, progress));
      }

      // selesai
      if (newTime <= 0) {
        clearInterval(intervalId);
        onFinish?.();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime, durationInSeconds, onFinish, onProgress]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <span className="font-semibold">
      {mins}:{secs.toString().padStart(2, "0")}
    </span>
  );
}
