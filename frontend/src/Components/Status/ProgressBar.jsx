import { useEffect, useState } from "react";
import "./ProgressBar.css";

const ProgressBar = ({ index, activeIndex, duration }) => {
  const [progress, setProgress] = useState(0);

  const isActive = index === activeIndex;
  const isCompleted = index < activeIndex;

  useEffect(() => {
    setProgress(0);

    if (!isActive) return;

    const startTime = Date.now();

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percentage = Math.min((elapsed / duration) * 100, 100);

      setProgress(percentage);

      if (percentage >= 100) {
        clearInterval(intervalId);
      }
    }, 30);

    return () => clearInterval(intervalId);
  }, [activeIndex, duration, isActive]);

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{
          width: isCompleted
            ? "100%"
            : isActive
              ? `${progress}%`
              : "0%",
        }}
      />
    </div>
  );
};

export default ProgressBar;
