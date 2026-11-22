import { useEffect, useState } from "react";
import Button from "../components/Button";
import SectionCard from "../components/SectionCard";
import TextField from "../components/TextField";
import { defaultSettings } from "../data/defaultSettings";

function validate(draft) {
  const errors = {};
  if (draft.displayName.trim() === "") errors.displayName = "Please enter a display name.";
  else if (draft.displayName.trim().length > 30) errors.displayName = "Use 30 characters or fewer.";

  const study = Number(draft.studyMinutes);
  if (!Number.isInteger(study) || study < 1 || study > 180) errors.studyMinutes = "Enter a whole number from 1 to 180.";

  const rest = Number(draft.breakMinutes);
  if (!Number.isInteger(rest) || rest < 1 || rest > 60) errors.breakMinutes = "Enter a whole number from 1 to 60.";
  return errors;
}

export default function SettingsPage({ settings, onSaveSettings }) {
  // One object holds the whole form (object state). Inputs are controlled by it.
  const [draft, setDraft] = useState({
    displayName: settings.displayName,
    studyMinutes: String(settings.studyMinutes),
    breakMinutes: String(settings.breakMinutes),
    compactCards: settings.compactCards,
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // Hide the "saved" message after a moment; cleanup cancels the timer.
  useEffect(() => {
    if (!saved) return;
    const timeoutId = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timeoutId);
  }, [saved]);

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setDraft((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setSaved(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSaveSettings({
      displayName: draft.displayName.trim(),
      studyMinutes: Number(draft.studyMinutes),
      breakMinutes: Number(draft.breakMinutes),
      compactCards: draft.compactCards,
    });
    setSaved(true);
  }

  function handleRestoreDefaults() {
    setDraft({
      displayName: defaultSettings.displayName,
      studyMinutes: String(defaultSettings.studyMinutes),
      breakMinutes: String(defaultSettings.breakMinutes),
      compactCards: defaultSettings.compactCards,
    });
    setErrors({});
    onSaveSettings(defaultSettings);
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Settings</h1>
        <p className="mt-1 text-slate-600">Make StudyFlow feel like yours. Saved in this browser.</p>
      </div>

      {saved && (
        <p role="status" className="rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
          Settings saved.
        </p>
      )}

      <SectionCard title="Preferences" className="max-w-2xl">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <TextField
            label="Display name"
            name="displayName"
            value={draft.displayName}
            onChange={handleChange}
            error={errors.displayName}
            autoComplete="nickname"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Study session (minutes)"
              name="studyMinutes"
              type="number"
              inputMode="numeric"
              min="1"
              max="180"
              value={draft.studyMinutes}
              onChange={handleChange}
              error={errors.studyMinutes}
            />
            <TextField
              label="Break (minutes)"
              name="breakMinutes"
              type="number"
              inputMode="numeric"
              min="1"
              max="60"
              value={draft.breakMinutes}
              onChange={handleChange}
              error={errors.breakMinutes}
            />
          </div>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="compactCards"
              checked={draft.compactCards}
              onChange={handleChange}
              className="mt-1 h-5 w-5 accent-teal-700"
            />
            <span>
              <span className="block text-sm font-medium text-slate-800">Compact task cards</span>
              <span className="block text-xs text-slate-600">Smaller cards so more tasks fit on screen.</span>
            </span>
          </label>

          <div className="flex flex-wrap gap-2">
            <Button type="submit">Save settings</Button>
            <Button variant="secondary" onClick={handleRestoreDefaults}>
              Restore defaults
            </Button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
