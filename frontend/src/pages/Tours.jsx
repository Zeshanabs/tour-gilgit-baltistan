import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TourCard from '../components/TourCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fallbackTours } from '../data/tourPackages';

function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [duration, setDuration] = useState('Any length');
  const [travelStyle, setTravelStyle] = useState('All journeys');

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

  const filteredTours = useMemo(() => tours.filter((tour) => {
    const byDuration = duration === 'Any length' || (duration === 'Short escape' && tour.durationDays <= 4) || (duration === '5–6 days' && tour.durationDays >= 5 && tour.durationDays <= 6) || (duration === 'One week+' && tour.durationDays >= 7);
    const text = `${tour.title} ${tour.summary}`.toLowerCase();
    const byStyle = travelStyle === 'All journeys' || (travelStyle === 'Culture & heritage' && /(heritage|hunza|shigar|khaplu|gilgit)/.test(text)) || (travelStyle === 'Lakes & landscapes' && /(lake|skardu|deosai|ghizer|astore)/.test(text)) || (travelStyle === 'Trekking' && /(trek|fairy meadows|nanga parbat)/.test(text));
    return byDuration && byStyle;
  }), [tours, duration, travelStyle]);

  return (
    <div className="space-y-12 pb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-teal-950 p-8 text-white shadow-sm sm:p-12">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative max-w-3xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-300">Find your mountain journey</p><h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Tour Packages</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-100">
          Thoughtful, season-aware journeys across Hunza, Skardu, Shigar, Astore and Diamer—built around realistic travel days, local heritage and time outdoors.
        </p>
        <p className="mt-4 max-w-2xl leading-7 text-teal-100">Choose a ready-made route as a starting point, then tailor the pace, accommodation and transport to your group.</p></div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="section-kicker">Package finder</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">Choose your kind of journey</h2></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Trip length<select value={duration} onChange={(event) => setDuration(event.target.value)} className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-teal-700"><option>Any length</option><option>Short escape</option><option>5–6 days</option><option>One week+</option></select></label><label className="text-sm font-semibold text-slate-700">Travel style<select value={travelStyle} onChange={(event) => setTravelStyle(event.target.value)} className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-teal-700"><option>All journeys</option><option>Culture & heritage</option><option>Lakes & landscapes</option><option>Trekking</option></select></label></div></div></section>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 text-rose-700">{error}</div>
      ) : filteredTours.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-700">No package matches those choices yet. Try a different trip length or <button type="button" onClick={() => { setDuration('Any length'); setTravelStyle('All journeys'); }} className="font-bold text-teal-800 underline">clear the filters</button>.</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3 md:grid-cols-2">
          {filteredTours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[1fr_.95fr]"><div className="rounded-2xl bg-amber-100 p-8 sm:p-10"><p className="section-kicker">Tailor-made travel</p><h2 className="mt-3 text-3xl font-semibold text-slate-950">Want to combine valleys or travel differently?</h2><p className="mt-4 max-w-xl leading-7 text-slate-700">Tell us your dates, group size, starting city and interests. We can suggest the right road route, add rest nights, or shape a private family, friends or photography trip.</p><Link to="/inquire" className="mt-7 inline-flex rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">Request a custom plan</Link></div><div className="rounded-2xl border border-slate-200 bg-white p-8"><p className="section-kicker">How planning works</p><ol className="mt-5 space-y-5"><li className="flex gap-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-800 text-sm font-bold text-white">1</span><p className="text-sm leading-6 text-slate-600"><strong className="text-slate-950">Share your idea.</strong> Send dates, group size and your preferred travel style.</p></li><li className="flex gap-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-800 text-sm font-bold text-white">2</span><p className="text-sm leading-6 text-slate-600"><strong className="text-slate-950">Review the route.</strong> Confirm the pacing, stays, transport and what is included.</p></li><li className="flex gap-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-800 text-sm font-bold text-white">3</span><p className="text-sm leading-6 text-slate-600"><strong className="text-slate-950">Travel prepared.</strong> Receive practical notes for the season, altitude and mountain roads.</p></li></ol></div></section>

      <section className="border-t border-slate-200 pt-12"><p className="section-kicker">Useful answers</p><h2 className="mt-2 text-3xl font-semibold text-slate-950">Before you book</h2><div className="mt-7 grid gap-5 md:grid-cols-3"><article><h3 className="font-semibold text-slate-950">Can the itinerary change?</h3><p className="mt-2 text-sm leading-6 text-slate-600">Yes. Mountain weather and road access matter, so a good plan includes sensible alternatives and enough time to adapt.</p></article><article><h3 className="font-semibold text-slate-950">What is included?</h3><p className="mt-2 text-sm leading-6 text-slate-600">Each package shows its own inclusions and exclusions. Confirm the exact accommodation, meals, permits and transport before booking.</p></article><article><h3 className="font-semibold text-slate-950">Which season is best?</h3><p className="mt-2 text-sm leading-6 text-slate-600">Most valley trips run best from April to October; high routes such as Deosai and Khunjerab have shorter access windows.</p></article></div></section>
    </div>
  );
}

export default Tours;
