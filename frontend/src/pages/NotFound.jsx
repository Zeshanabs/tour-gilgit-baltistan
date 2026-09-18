import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';

function NotFound() {
  usePageMeta('Page not found | GB Tourism', 'This page could not be found on the GB Tourism site.');

  return (
    <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
      <h1 className="text-5xl font-semibold text-slate-900">404</h1>
      <p className="mt-4 text-xl text-slate-600">Oops! The page you are looking for does not exist.</p>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          to="/"
          className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Back to home
        </Link>
        <Link
          to="/destinations"
          className="rounded-full border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          Browse destinations
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
