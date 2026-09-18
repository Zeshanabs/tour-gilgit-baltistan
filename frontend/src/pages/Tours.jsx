import { useEffect, useState } from 'react';
import api from '../services/api';
import TourCard from '../components/TourCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fallbackTours } from '../data/tourPackages';

function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data } = await api.get('/api/tours');
        setTours(data?.length ? data : fallbackTours);
      } catch (err) {
        setTours(fallbackTours);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <div className="space-y-10">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">Tour Packages</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Thoughtful, season-aware journeys across Hunza, Skardu, Shigar, Astore and Diamer—built around realistic travel days, local heritage and time outdoors.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 text-rose-700">{error}</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3 md:grid-cols-2">
          {tours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tours;
