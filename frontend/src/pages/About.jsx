import usePageMeta from '../hooks/usePageMeta';

function About() {
  usePageMeta('About | GB Tourism', 'Learn about GB Tourism and our local travel services in Gilgit-Baltistan.');

  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">About GB Tourism</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          GB Tourism is a locally owned travel operator dedicated to authentic journeys across Gilgit-Baltistan. We craft personalized tour packages with experienced local guides and reliable transport.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-sm">
          <h2 className="text-2xl font-semibold">Local expertise</h2>
          <p className="mt-4 text-slate-300 leading-7">
            Our team lives in the region and builds itineraries using local travel knowledge, mountain routes, and village stays.
          </p>
        </div>
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-sm">
          <h2 className="text-2xl font-semibold">Trusted service</h2>
          <p className="mt-4 text-slate-300 leading-7">
            We handle transport, accommodation, and guided tours so visitors can enjoy Gilgit-Baltistan with confidence and comfort.
          </p>
        </div>
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-sm">
          <h2 className="text-2xl font-semibold">Sustainable travel</h2>
          <p className="mt-4 text-slate-300 leading-7">
            We support local communities and responsible travel practices while sharing the natural beauty of the mountains.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
