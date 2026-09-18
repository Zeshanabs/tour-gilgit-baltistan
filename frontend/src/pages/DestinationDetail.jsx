import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PlaceCard from '../components/PlaceCard';

const visualLibrary = {
  Lake: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1443632864897-14973fa006cf?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85',
  ],
  Fort: [
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=85',
  ],
  default: [
    'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1400&q=85&sat=-20',
    'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1400&q=85',
  ],
};

function getEditorial(place) {
  const noun = place.category?.toLowerCase() || 'mountain destination';
  return {
    title: `A local guide to ${place.name}`,
    opening: `${place.name} rewards travellers who slow down. This ${noun} in ${place.district} is at its best when you leave time for changing light, short walks and the small conversations that make a mountain journey memorable.`,
    paragraphs: [
      `Begin with the landscape. ${place.fullDescription || `${place.name} offers a distinctive window onto Gilgit-Baltistan’s high valleys and living culture.`} Early morning and late afternoon are especially good for photographs, when the air is clear and the surrounding contours take on warmer colour.`,
      `Plan the day with a little flexibility: road conditions, weather and local rhythms all shape the experience. A driver or local guide can help turn a simple stop into a fuller visit, whether that means finding a quiet viewpoint, understanding local traditions or allowing extra time for the road.`,
    ],
    dayStory: `A good day around ${place.name} starts before the busiest hours. Begin with the main viewpoint or landmark while the light is low, then take a slower middle of the day for tea, a local meal or a short walk. Save the final hour for the road back: in the mountains, the journey between places is often as memorable as the destination itself.`,
    seasons: `The stated travel window—${place.bestTimeToVisit || 'the warmer mountain months'}—is a guide rather than a guarantee. Higher routes can open later and close earlier than expected, while rain, snow or road work can reshape a plan at short notice. Confirm local conditions before leaving your base.`,
    tips: [
      `Travel in ${place.bestTimeToVisit || 'the suitable season'} for the most comfortable access.`,
      'Carry a warm layer, sun protection, water and comfortable walking shoes.',
      'Ask before photographing people, homes or religious places, and leave no trace.',
    ],
  };
}

function DestinationDetail() {
  const { slug } = useParams();
  const [place, setPlace] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const { data } = await api.get(`/api/places/${slug}`);
        setPlace(data);
        const relatedRes = await api.get('/api/places', { params: { district: data.district } });
        setRelated((relatedRes.data || []).filter((item) => item.slug !== data.slug).slice(0, 3));
      } catch (err) {
        setError('Unable to load this destination.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !place) {
    return <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700">{error || 'Destination not found.'}</div>;
  }

  const article = getEditorial(place);
  const galleryImages = [...(place.images || []), ...(visualLibrary[place.category] || visualLibrary.default)].filter((image, index, images) => images.indexOf(image) === index).slice(0, 4);

  return (
    <div className="space-y-16">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[2rem] bg-white shadow-sm">
          <img
            src={place.images?.[0] || 'https://source.unsplash.com/1200x800/?mountains'}
            alt={place.name}
            className="h-[420px] w-full object-cover rounded-t-[2rem]"
          />
          <div className="p-8">
            <div className="mb-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">{place.district}</span>
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">{place.category}</span>
            </div>
            <h1 className="text-4xl font-semibold text-slate-900">{place.name}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">{place.fullDescription}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Best time to visit</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{place.bestTimeToVisit || 'Anytime'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Location</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{place.location?.lat && place.location?.lng ? `${place.location.lat}, ${place.location.lng}` : 'Coordinates unavailable'}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-sm">
            <img src={galleryImages[1] || galleryImages[0]} alt={`Mountain landscape near ${place.name}`} className="h-60 w-full object-cover opacity-85" />
            <div className="p-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Travel note</p><h2 className="mt-2 text-2xl font-semibold">Make time to linger.</h2><p className="mt-3 text-sm leading-6 text-slate-200">The most rewarding moments here are often between the headline sights: tea with a view, a village lane, or a last look at the mountains before dusk.</p></div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Quick facts</h2>
            <ul className="mt-6 space-y-3 text-slate-600">
              <li>
                <span className="font-semibold text-slate-900">District:</span> {place.district}
              </li>
              <li>
                <span className="font-semibold text-slate-900">Category:</span> {place.category || 'N/A'}
              </li>
              <li>
                <span className="font-semibold text-slate-900">Slug:</span> {place.slug}
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <section className="space-y-6">
        <div><p className="section-kicker">Visual diary</p><h2 className="mt-2 text-3xl font-semibold text-slate-900">Scenes from the journey</h2></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((image, index) => (
            <img key={index} src={image} alt={`${place.name} ${index + 1}`} className="h-64 w-full rounded-3xl object-cover" />
          ))}
        </div>
      </section>

      <section className="grid gap-10 border-y border-slate-200 py-14 lg:grid-cols-[1.25fr_.75fr]">
        <article className="max-w-3xl"><p className="section-kicker">Destination journal</p><h2 className="mt-2 text-3xl font-semibold text-slate-950">{article.title}</h2><p className="mt-6 text-lg leading-8 text-slate-700">{article.opening}</p><div className="mt-7 space-y-5 text-base leading-8 text-slate-600">{article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>
        <aside className="rounded-2xl bg-teal-900 p-7 text-white"><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Before you go</p><h3 className="mt-3 text-2xl font-semibold">Practical notes</h3><ul className="mt-5 space-y-4 text-sm leading-6 text-teal-50">{article.tips.map((tip) => <li className="border-b border-white/15 pb-4 last:border-0 last:pb-0" key={tip}>{tip}</li>)}</ul><Link to="/inquire" className="mt-7 inline-flex rounded-md bg-amber-300 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-200">Plan this visit</Link></aside>
      </section>

      <section className="grid gap-7 md:grid-cols-2">
        <article className="rounded-3xl bg-white p-8 shadow-sm"><p className="section-kicker">A day in {place.name}</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">Follow the rhythm of the valley.</h2><p className="mt-5 leading-7 text-slate-600">{article.dayStory}</p></article>
        <article className="rounded-3xl bg-slate-100 p-8"><p className="section-kicker">Seasonal note</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">Plan with the mountains, not against them.</h2><p className="mt-5 leading-7 text-slate-600">{article.seasons}</p></article>
      </section>

      {related.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-600">You might also like</p>
              <h2 className="text-3xl font-semibold text-slate-900">More places in {place.district}</h2>
            </div>
            <Link to="/destinations" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
              View all destinations →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <PlaceCard key={item.slug} place={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default DestinationDetail;
