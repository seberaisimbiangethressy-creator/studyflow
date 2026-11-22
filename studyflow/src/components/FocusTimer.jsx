import { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import TimerControls from "./TimerControls";
import Badge from "./Badge";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Countdown timer.
 * - The fast-changing state (secondsLeft, running) lives HERE, not in App, so a tick
 *   re-renders only this component - not the layout, navbar or task list.
 * - The interval id is stored in a ref: it is not shown on screen, and changing it
 *   must not cause a re-render.
 * - The parent gives this component a `key` (the session type). Changing the key
 *   unmounts it and mounts a brand-new timer, which resets all of its state.
 */
export default function FocusTimer({ label, minutes, onComplete }) {
  if (import.meta.env.DEV) console.log(`[render] FocusTimer (${label})`);

  const totalSeconds = minutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // Derived values - computed during render, not stored in extra state or Effects.
  const finished = secondsLeft === 0;
  const ticking = running && !finished;
  const percentDone = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);
  const status = finished ? "Finished" : ticking ? "Running" : secondsLeft === totalSeconds ? "Ready" : "Paused";

  // One interval while ticking. The cleanup runs when ticking turns false and when the
  // component unmounts (leaving /focus or switching session), so no timer is left behind.
  useEffect(() => {
    if (!ticking) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [ticking]);

  // Tell the parent once when the countdown reaches zero.
  useEffect(() => {
    if (finished) onComplete?.();
  }, [finished, onComplete]);

  function handleReset() {
    setRunning(false);
    setSecondsLeft(totalSeconds);
  }

  return (
    <div className="text-center">
      <div className="mb-2 flex items-center justify-center gap-2">
        <h3 className="text-lg font-semibold text-navy">{label} session</h3>
        <Badge tone={finished ? "completed" : ticking ? "pending" : "neutral"}>{status}</Badge>
      </div>
      <p
        role="timer"
        aria-label={`${formatTime(secondsLeft)} remaining`}
        className="my-4 text-6xl font-bold tabular-nums text-navy sm:text-7xl"
      >
        {formatTime(secondsLeft)}
      </p>
      <div className="mx-auto mb-6 max-w-md">
        <ProgressBar value={percentDone} label={`${label} session progress`} />
      </div>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
      <TimerControls
        running={ticking}
        finished={finished}
        onStart={() => setRunning(true)}
        onPause={() => setRunning(false)}
        onReset={handleReset}
      />
    </div>
  );
}
