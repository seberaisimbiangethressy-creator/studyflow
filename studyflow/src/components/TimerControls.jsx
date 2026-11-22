import Button from "./Button";

/** Start / Pause / Reset buttons. All behaviour arrives through callback props. */
export default function TimerControls({ running, finished, onStart, onPause, onReset }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button size="lg" onClick={onStart} disabled={running || finished}>
        {running ? "Running..." : "Start"}
      </Button>
      <Button size="lg" variant="secondary" onClick={onPause} disabled={!running}>
        Pause
      </Button>
      <Button size="lg" variant="secondary" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
