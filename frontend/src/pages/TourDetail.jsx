import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import InquiryForm from '../components/InquiryForm';
import { fallbackTours } from '../data/tourPackages';

function TourDetail() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const { data } = await api.get(`/api/tours/${slug}`);
        setTour(data);
      } catch (err) {
        const fallback = fallbackTours.find((item) => item.slug === slug);
        if (fallback) setTour(fallback);
        else setError('Unable to load this tour package.');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  useEffect(() => {
    if (tour) {
      document.title = `${tour.title} | GB Tourism`;
      const description = tour.summary || 'Discover this tour package in Gilgit-Baltistan.';
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', description);
      }
    }
  }, [tour]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !tour) {
    return <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700">{error || 'Tour package not found.'}</div>;
  }

  return (
    <div className="space-y-10">
      <div className="rounded-[2rem] bg-white shadow-sm">
        <img
          src={tour.coverImage || 'https://source.unsplash.com/1200x600/?travel'}
          alt={tour.title}
          className="h-[420px] w-full object-cover rounded-t-[2rem]"
        />
        <div className="p-8">
          <div className="mb-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">{tour.durationDays} days</span>
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">{tour.price ? `$${tour.price} USD` : 'Custom quote'}</span>
          </div>
          <h1 className="text-4xl font-semibold text-slate-900">{tour.title}</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">{tour.summary}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#book-form" className="rounded-full bg-amber-300 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-400">
              Inquire / Book Now
            </a>
            <Link to="/tours" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-900">
              Back to tours
            </Link>
          </div>
        </div>
      </div>

      <section className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Itinerary</h2>
            <div className="mt-6 space-y-4">
              {tour.itinerary?.map((item) => (
                <div key={item.day} className="rounded-3xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">Day {item.day}</span>
                    <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What’s included</h3>
              <ul className="mt-4 space-y-3 text-slate-600">
                {tour.inclusions?.length ? (
                  tour.inclusions.map((item, index) => <li key={index}>• {item}</li>)
                ) : (
                  <li>No inclusions specified.</li>
                )}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What’s not included</h3>
              <ul className="mt-4 space-y-3 text-slate-600">
                {tour.exclusions?.length ? (
                  tour.exclusions.map((item, index) => <li key={index}>• {item}</li>)
                ) : (
                  <li>No exclusions specified.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold text-slate-900">Included Places</h2>
            <div className="mt-6 space-y-4">
              {tour.includedPlaces?.length ? (
                tour.includedPlaces.map((place) => (
                  <Link
                    key={place._id || place.slug}
                    to={`/destinations/${place.slug}`}
                    className="block rounded-3xl border border-slate-200 p-5 text-slate-700 transition hover:border-sky-300 hover:bg-slate-50"
                  >
                    <p className="font-semibold text-slate-900">{place.name}</p>
                    <p className="text-sm text-slate-600">{place.district}</p>
                  </Link>
                ))
              ) : (
                <p className="text-slate-600">No places linked yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-sky-700 p-8 text-white shadow-sm">
            <h2 className="text-3xl font-semibold">Travel tips</h2>
            <p className="mt-4 text-slate-100">Pack warm layers, bring a camera, and be ready for high-altitude weather variations.</p>
          </div>
        </aside>
      </section>

      <section id="book-form" className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-semibold text-slate-900">Book this tour</h2>
        <p className="mt-3 text-slate-600">Send an inquiry and our local team will help you finalize your plans.</p>
        <div className="mt-8">
          <InquiryForm selectedTour={tour} />
        </div>
      </section>
    </div>
  );
}

export default TourDetail;
