import { useState, useEffect, useMemo } from "react";

export default function Timer({
  baseMinutes,
  orderId,
  antrean = [],
  onFinish,
  onProgress,
}) {
  const storageKey = useMemo(() => `order_end_time_${orderId}`, [orderId]);
  const finishedKey = useMemo(() => `order_finished_${orderId}`, [orderId]);

  // Hitung waktu awal berdasarkan antrean
  const calculateInitialTime = () => {
    if (localStorage.getItem(finishedKey) === "true") return 0;

    let totalAntrean = antrean.reduce((sum, p) => sum + (p.sisaWaktu || 0), 0);
    const savedEndTime = localStorage.getItem(storageKey);

    if (savedEndTime) {
      const remaining = Math.floor((savedEndTime - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }

    // total menit = baseMinutes pesanan ini + total sisa waktu antrean
    return (baseMinutes + totalAntrean) * 60;
  };

  const [timeLeft, setTimeLeft] = useState(calculateInitialTime);

  useEffect(() => {
    if (!orderId) return;

    if (localStorage.getItem(finishedKey) === "true") {
      setTimeLeft(0);
      onFinish?.();
      return;
    }

    let savedEndTime = localStorage.getItem(storageKey);
    if (!savedEndTime) {
      savedEndTime = Date.now() + timeLeft * 1000;
      localStorage.setItem(storageKey, savedEndTime);
    }

    const interval = setInterval(() => {
      // Hitung sisa waktu real-time berdasarkan antrean
      let totalAntrean = antrean.reduce(
        (sum, p) => sum + (p.sisaWaktu || 0),
        0
      );
      let remaining = Math.floor(savedEndTime - Date.now()) / 1000;

      // jika ada selisih karena antrean selesai lebih cepat
      const adjustment = (baseMinutes + totalAntrean) * 60 - timeLeft;
      remaining = remaining - adjustment;

      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        localStorage.removeItem(storageKey);
        localStorage.setItem(finishedKey, "true");
        onFinish?.();
      } else {
        setTimeLeft(Math.floor(remaining));
        if (onProgress) {
          const totalDuration = (baseMinutes + totalAntrean) * 60;
          onProgress(((totalDuration - remaining) / totalDuration) * 100);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    baseMinutes,
    antrean,
    orderId,
    onFinish,
    onProgress,
    storageKey,
    finishedKey,
  ]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <span className="font-semibold">
      {mins}:{secs.toString().padStart(2, "0")}
    </span>
  );
}
