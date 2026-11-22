import { Link } from "react-router-dom";
import SectionCard from "../components/SectionCard";

export default function NotFoundPage() {
  return (
    <SectionCard className="mx-auto max-w-xl text-center">
      <p className="text-5xl font-bold text-accent">404</p>
      <h1 className="mt-3 text-2xl font-bold text-navy">We couldn't find that page</h1>
      <p className="mt-2 text-slate-600">
        The address you opened doesn't exist in StudyFlow. It may have been mistyped or moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark"
      >
        Back to Dashboard
      </Link>
    </SectionCard>
  );
}
