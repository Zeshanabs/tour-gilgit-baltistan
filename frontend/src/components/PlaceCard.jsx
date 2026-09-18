import { Link } from 'react-router-dom';

function PlaceCard({ place }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/destinations/${place.slug}`} className="block h-48 overflow-hidden">
        <img
          src={place.images?.[0] || 'https://source.unsplash.com/800x600/?mountains'}
          alt={place.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-5">
        <div className="mb-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
          {place.district}
        </div>
        <h3 className="text-xl font-semibold text-slate-900">{place.name}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{place.shortDescription}</p>
        <Link
          to={`/destinations/${place.slug}`}
          className="mt-5 inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}

export default PlaceCard;
