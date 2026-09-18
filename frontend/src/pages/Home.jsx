import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PlaceCard from '../components/PlaceCard';
import TourCard from '../components/TourCard';
import LoadingSpinner from '../components/LoadingSpinner';

const highlights = [
  { number: '7,788 m', label: 'Rakaposhi, seen from the Karakoram Highway' },
  { number: '4,114 m', label: 'Deosai’s vast high-altitude plateau' },
  { number: 'Apr-Oct', label: 'Prime season for most valley journeys' },
];

const routes = [
  { name: 'Hunza & Upper Hunza', detail: 'Forts, apricot villages, Attabad Lake and the Passu peaks.', tag: 'Culture + scenery', image: 'https://www.onthegotours.com/repository/Attabad-Lake--Pakistan-1084091763470758_crop_flip_2250_1200_f2f2f2_center-center.jpg', to: '/destinations' },
  { name: 'Skardu & Deosai', detail: 'Cold desert, heritage palaces, lakes and the plains of Deosai.', tag: 'Lakes + landscapes', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/The_Land_of_Giants%2C_Deosai.jpg', to: '/tours' },
  { name: 'Fairy Meadows', detail: 'A classic mountain escape beneath the north face of Nanga Parbat.', tag: 'Trek + cabins', image: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nanga_parbat%2C_fairy_medow%2C_Pak_by_gul791.jpg', to: '/inquire' },
];

const travelPillars = [
  ['Local knowledge', 'Guides, drivers and routes shaped by people who know the mountains.'],
  ['Private pacing', 'Build a journey around your group, comfort level and available days.'],
  ['Clear planning', 'Ask about transport, stays, permits and seasonal access before you book.'],
];

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1589213663665-c388d8225f89?auto=format&fit=crop&w=2200&q=85',
    alt: 'Mountain road through the Karakoram landscape',
    eyebrow: 'Gilgit-Baltistan, Pakistan',
    title: 'Mountain journeys with room to breathe.',
    description: 'From Hunza’s high villages to Skardu’s open landscapes, discover a considered way to travel through the Karakoram.',
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/The_Land_of_Giants%2C_Deosai.jpg',
    alt: 'Wide open plains of Deosai beneath a dramatic sky',
    eyebrow: 'Wild landscapes',
    title: 'Find your way into the high country.',
    description: 'Follow quiet roads through cold desert, alpine meadows and valleys shaped by some of the world’s greatest peaks.',
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nanga_parbat%2C_fairy_medow%2C_Pak_by_gul791.jpg',
    alt: 'Nanga Parbat rising above Fairy Meadows',
    eyebrow: 'Trek & stay',
    title: 'Wake up close to the mountains.',
    description: 'Trade the rush for trail days, warm cabins and unhurried mornings beneath the north face of Nanga Parbat.',
  },
  {
    image: 'https://www.onthegotours.com/repository/Attabad-Lake--Pakistan-1084091763470758_crop_flip_2250_1200_f2f2f2_center-center.jpg',
    alt: 'Turquoise Attabad Lake surrounded by Karakoram mountains',
    eyebrow: 'Hunza & Upper Hunza',
    title: 'Follow the colour of the Karakoram.',
    description: 'Sail Attabad Lake, meet village hosts and watch the Passu peaks change colour at the end of the day.',
  },
];

function Home() {
  const [places, setPlaces] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesRes, toursRes] = await Promise.all([api.get('/api/places'), api.get('/api/tours')]);
        setPlaces(placesRes.data || []);
        setTours(toursRes.data || []);
      } catch (err) {
        setError('Our full destination catalogue is loading soon. You can still start planning below.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5500);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="space-y-20 pb-8">
      <section className="relative -mx-4 flex min-h-[650px] items-end overflow-hidden px-6 py-12 sm:-mx-8 sm:px-10 lg:-mx-8 lg:min-h-[710px] lg:px-16 lg:py-16">
        {heroSlides.map((slide, index) => (
          <img key={slide.image} src={slide.image} alt={index === activeSlide ? slide.alt : ''} aria-hidden={index !== activeSlide} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/10" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div className="max-w-3xl text-white"><p className="mb-5 text-sm font-bold uppercase tracking-[0.16em] text-amber-300">{heroSlides[activeSlide].eyebrow}</p><h1 className="max-w-2xl text-5xl font-semibold leading-[1.04] sm:text-6xl">{heroSlides[activeSlide].title}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-100">{heroSlides[activeSlide].description}</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/tours" className="rounded-md bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200">Explore journeys</Link><Link to="/inquire" className="rounded-md border border-white/60 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20">Plan a private trip</Link></div></div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-white/20 bg-white/20 backdrop-blur-md">{highlights.map((item) => <div className="bg-slate-950/45 p-4 text-white sm:p-5" key={item.number}><p className="text-xl font-semibold text-amber-300 sm:text-2xl">{item.number}</p><p className="mt-2 text-xs leading-5 text-slate-200">{item.label}</p></div>)}</div>
        </div>
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2" aria-label="Hero image slides">
          {heroSlides.map((slide, index) => <button key={slide.title} type="button" onClick={() => setActiveSlide(index)} aria-label={`Show slide ${index + 1}: ${slide.title}`} aria-current={index === activeSlide} className={`h-2.5 rounded-full transition-all ${index === activeSlide ? 'w-8 bg-amber-300' : 'w-2.5 bg-white/70 hover:bg-white'}`} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="section-kicker">Start with a region</p><h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">Three unforgettable ways north</h2></div><Link to="/destinations" className="text-sm font-bold text-teal-800 hover:text-teal-950">Browse every destination</Link></div><div className="grid gap-5 md:grid-cols-3">{routes.map((route) => <Link to={route.to} key={route.name} className="group relative min-h-[360px] overflow-hidden rounded-md bg-slate-900"><img src={route.image} alt={route.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-300">{route.tag}</p><h3 className="mt-2 text-2xl font-semibold">{route.name}</h3><p className="mt-2 text-sm leading-6 text-slate-200">{route.detail}</p></div></Link>)}</div></section>

      <section className="border-y border-slate-200 bg-white py-16"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><p className="section-kicker">Travel well</p><h2 className="mt-2 text-3xl font-semibold text-slate-950">The trip should feel as good as the view.</h2><p className="mt-4 max-w-md leading-7 text-slate-600">Built around the practical details that make high-mountain travel more relaxed: sensible routes, local context and straight answers.</p></div><div className="grid gap-6 sm:grid-cols-3">{travelPillars.map(([title, detail], index) => <div className="border-l-2 border-amber-400 pl-5" key={title}><p className="text-xs font-bold text-teal-800">0{index + 1}</p><h3 className="mt-3 text-lg font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p></div>)}</div></div></section>

      <section className="mx-auto max-w-7xl"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="section-kicker">Explore deeper</p><h2 className="mt-2 text-3xl font-semibold text-slate-950">Featured destinations</h2></div><Link to="/destinations" className="text-sm font-bold text-teal-800 hover:text-teal-950">See all</Link></div>{loading ? <LoadingSpinner /> : error ? <p className="border-l-2 border-amber-400 pl-4 text-slate-600">{error}</p> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{places.slice(0, 6).map((place) => <PlaceCard key={place.slug} place={place} />)}</div>}</section>

      {!loading && !error && <section className="mx-auto max-w-7xl"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="section-kicker">Ready-made itineraries</p><h2 className="mt-2 text-3xl font-semibold text-slate-950">Popular journeys</h2></div><Link to="/tours" className="text-sm font-bold text-teal-800 hover:text-teal-950">View packages</Link></div><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{tours.slice(0, 3).map((tour) => <TourCard key={tour.slug} tour={tour} />)}</div></section>}

      <section className="mx-auto max-w-7xl overflow-hidden rounded-md bg-teal-900 px-7 py-10 text-white sm:px-10 sm:py-14"><div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.15em] text-amber-300">Not sure where to begin?</p><h2 className="mt-3 text-3xl font-semibold">Tell us what kind of trip you have in mind.</h2><p className="mt-3 max-w-xl leading-7 text-teal-50">Share your dates, group size and interests. We’ll help you find the right route for the season.</p></div><div className="lg:text-right"><Link to="/inquire" className="inline-flex rounded-md bg-white px-5 py-3 text-sm font-bold text-teal-950 transition hover:bg-amber-100">Send an inquiry</Link></div></div></section>
    </div>
  );
}

export default Home;
