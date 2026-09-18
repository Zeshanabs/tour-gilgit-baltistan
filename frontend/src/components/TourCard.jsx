import { Link } from 'react-router-dom';

function TourCard({ tour }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/tours/${tour.slug}`} className="block h-52 overflow-hidden">
        <img
          src={tour.coverImage || 'https://source.unsplash.com/800x600/?travel'}
          alt={tour.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-slate-900">{tour.title}</h3>
        <p className="mt-2 text-sm text-slate-500">{tour.summary}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-slate-700">
          <span className="rounded-full bg-slate-100 px-3 py-1">{tour.durationDays} days</span>
          <span className="rounded-full bg-amber-100 px-3 py-1">{tour.price ? `$${tour.price} USD` : 'Custom quote'}</span>
        </div>
        <Link
          to={`/tours/${tour.slug}`}
          className="mt-5 inline-flex items-center text-sm font-semibold text-slate-900 hover:text-sky-700"
        >
          View Itinerary →
        </Link>
      </div>
    </article>
  );
}

export default TourCard;
