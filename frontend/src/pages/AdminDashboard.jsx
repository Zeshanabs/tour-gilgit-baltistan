import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import usePageMeta from '../hooks/usePageMeta';
import Alert from '../components/Alert';

function getToken() {
  return localStorage.getItem('gb_admin_token');
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [places, setPlaces] = useState([]);
  const [tours, setTours] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [placeForm, setPlaceForm] = useState({
    name: '',
    district: '',
    slug: '',
    category: '',
    shortDescription: '',
    fullDescription: '',
    images: '',
    bestTimeToVisit: '',
  });
  const [tourForm, setTourForm] = useState({
    title: '',
    slug: '',
    durationDays: 0,
    price: 0,
    coverImage: '',
    summary: '',
    itinerary: '',
    includedPlaces: '',
    inclusions: '',
    exclusions: '',
  });
  const [editingPlaceSlug, setEditingPlaceSlug] = useState('');
  const [editingTourSlug, setEditingTourSlug] = useState('');

  usePageMeta('Admin dashboard | GB Tourism', 'Manage inquiries, places, and tour packages.');

  const resolveIncludedPlaces = (value) => {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const match = places.find((place) => place.slug === item || place._id === item);
        return match ? match._id : item;
      });
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [inqRes, placeRes, tourRes] = await Promise.all([
          api.get('/api/inquiries', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/api/places'),
          api.get('/api/tours'),
        ]);
        setInquiries(inqRes.data);
        setPlaces(placeRes.data);
        setTours(tourRes.data);
      } catch (error) {
        localStorage.removeItem('gb_admin_token');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('gb_admin_token');
    navigate('/admin/login');
  };

  const handleStatusChange = async (id, statusValue) => {
    try {
      const token = getToken();
      const { data } = await api.patch(
        `/api/inquiries/${id}`,
        { status: statusValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInquiries((prev) => prev.map((item) => (item._id === id ? data : item)));
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to update inquiry status.' });
    }
  };

  const clearPlaceForm = () => {
    setPlaceForm({
      name: '',
      district: '',
      slug: '',
      category: '',
      shortDescription: '',
      fullDescription: '',
      images: '',
      bestTimeToVisit: '',
    });
    setEditingPlaceSlug('');
  };

  const clearTourForm = () => {
    setTourForm({
      title: '',
      slug: '',
      durationDays: 0,
      price: 0,
      coverImage: '',
      summary: '',
      itinerary: '',
      includedPlaces: '',
      inclusions: '',
      exclusions: '',
    });
    setEditingTourSlug('');
  };

  const handlePlaceEdit = (place) => {
    setPlaceForm({
      name: place.name || '',
      district: place.district || '',
      slug: place.slug || '',
      category: place.category || '',
      shortDescription: place.shortDescription || '',
      fullDescription: place.fullDescription || '',
      images: (place.images || []).join(', '),
      bestTimeToVisit: place.bestTimeToVisit || '',
    });
    setEditingPlaceSlug(place.slug);
  };

  const handleTourEdit = (tour) => {
    const includedPlaces = (tour.includedPlaces || [])
      .map((item) => (item?.slug ? item.slug : item))
      .join(', ');

    setTourForm({
      title: tour.title || '',
      slug: tour.slug || '',
      durationDays: tour.durationDays || 0,
      price: tour.price || 0,
      coverImage: tour.coverImage || '',
      summary: tour.summary || '',
      itinerary: (tour.itinerary || []).map((item) => item.title).join('\n'),
      includedPlaces,
      inclusions: (tour.inclusions || []).join(', '),
      exclusions: (tour.exclusions || []).join(', '),
    });
    setEditingTourSlug(tour.slug);
  };

  const handlePlaceDelete = async (slug) => {
    try {
      const token = getToken();
      await api.delete(`/api/places/${slug}`, { headers: { Authorization: `Bearer ${token}` } });
      setPlaces((prev) => prev.filter((place) => place.slug !== slug));
      setStatus({ type: 'success', message: 'Place deleted.' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to delete place.' });
    }
  };

  const handleTourDelete = async (slug) => {
    try {
      const token = getToken();
      await api.delete(`/api/tours/${slug}`, { headers: { Authorization: `Bearer ${token}` } });
      setTours((prev) => prev.filter((tour) => tour.slug !== slug));
      setStatus({ type: 'success', message: 'Tour deleted.' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to delete tour.' });
    }
  };

  const handlePlaceSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = getToken();
      const payload = {
        ...placeForm,
        images: placeForm.images.split(',').map((item) => item.trim()).filter(Boolean),
      };

      let response;
      if (editingPlaceSlug) {
        response = await api.put(`/api/places/${editingPlaceSlug}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaces((prev) => prev.map((place) => (place.slug === editingPlaceSlug ? response.data : place)));
        setStatus({ type: 'success', message: 'Place updated successfully.' });
      } else {
        response = await api.post('/api/places', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaces((prev) => [response.data, ...prev]);
        setStatus({ type: 'success', message: 'Place created successfully.' });
      }

      clearPlaceForm();
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to save place.' });
    }
  };

  const handleTourSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = getToken();
      const payload = {
        title: tourForm.title,
        slug: tourForm.slug,
        durationDays: Number(tourForm.durationDays),
        price: Number(tourForm.price),
        coverImage: tourForm.coverImage,
        summary: tourForm.summary,
        itinerary: tourForm.itinerary
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line, index) => ({ day: index + 1, title: line, description: line })),
        inclusions: tourForm.inclusions.split(',').map((item) => item.trim()).filter(Boolean),
        exclusions: tourForm.exclusions.split(',').map((item) => item.trim()).filter(Boolean),
        includedPlaces: resolveIncludedPlaces(tourForm.includedPlaces),
      };

      let response;
      if (editingTourSlug) {
        response = await api.put(`/api/tours/${editingTourSlug}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTours((prev) => prev.map((tour) => (tour.slug === editingTourSlug ? response.data : tour)));
        setStatus({ type: 'success', message: 'Tour updated successfully.' });
      } else {
        response = await api.post('/api/tours', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTours((prev) => [response.data, ...prev]);
        setStatus({ type: 'success', message: 'Tour created successfully.' });
      }

      clearTourForm();
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to save tour.' });
    }
  };

  if (loading) {
    return <div className="text-center text-slate-700">Loading admin dashboard...</div>;
  }

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">Admin dashboard</h1>
          <p className="mt-2 text-slate-600">Manage inquiries, places, and tour packages.</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Log out
        </button>
      </div>
      <Alert type={status.type} message={status.message} />

      <div className="space-y-10">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-900">Inquiries</h2>
          <div className="mt-6 space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry._id} className="rounded-3xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{inquiry.name}</p>
                    <p className="text-sm text-slate-600">{inquiry.email} · {inquiry.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                      className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none"
                    >
                      {['new', 'contacted', 'confirmed', 'closed'].map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="mt-3 text-slate-700">Package: {inquiry.packageId?.title || 'General inquiry'}</p>
                <p className="mt-2 text-slate-600">Dates: {inquiry.preferredDates || 'Not specified'}</p>
                <p className="mt-2 text-slate-600">People: {inquiry.numberOfPeople}</p>
                <p className="mt-3 text-slate-700">{inquiry.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-10 xl:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold text-slate-900">Places</h2>
            <form onSubmit={handlePlaceSubmit} className="mt-6 space-y-4">
              {[
                { name: 'name', label: 'Name' },
                { name: 'district', label: 'District' },
                { name: 'slug', label: 'Slug' },
                { name: 'category', label: 'Category' },
                { name: 'bestTimeToVisit', label: 'Best time to visit' },
              ].map((field) => (
                <label key={field.name} className="block">
                  <span className="text-sm font-semibold text-slate-900">{field.label}</span>
                  <input
                    name={field.name}
                    value={placeForm[field.name]}
                    onChange={(e) => setPlaceForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Short description</span>
                <input
                  name="shortDescription"
                  value={placeForm.shortDescription}
                  onChange={(e) => setPlaceForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Full description</span>
                <textarea
                  name="fullDescription"
                  rows="3"
                  value={placeForm.fullDescription}
                  onChange={(e) => setPlaceForm((prev) => ({ ...prev, fullDescription: e.target.value }))}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Images (comma separated URLs)</span>
                <input
                  name="images"
                  value={placeForm.images}
                  onChange={(e) => setPlaceForm((prev) => ({ ...prev, images: e.target.value }))}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <button className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-400">
                {editingPlaceSlug ? 'Update place' : 'Create place'}
              </button>
            </form>

            <div className="mt-8 space-y-3">
              {places.map((place) => (
                <div key={place._id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">{place.name}</p>
                    <p className="text-sm text-slate-600">{place.slug}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handlePlaceEdit(place)}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePlaceDelete(place.slug)}
                      className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold text-slate-900">Tours</h2>
            <form onSubmit={handleTourSubmit} className="mt-6 space-y-4">
              {[
                { name: 'title', label: 'Title' },
                { name: 'slug', label: 'Slug' },
                { name: 'price', label: 'Price' },
                { name: 'durationDays', label: 'Duration (days)' },
                { name: 'coverImage', label: 'Cover image URL' },
              ].map((field) => (
                <label key={field.name} className="block">
                  <span className="text-sm font-semibold text-slate-900">{field.label}</span>
                  <input
                    name={field.name}
                    value={tourForm[field.name]}
                    onChange={(e) => setTourForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Summary</span>
                <textarea
                  name="summary"
                  rows="2"
                  value={tourForm.summary}
                  onChange={(e) => setTourForm((prev) => ({ ...prev, summary: e.target.value }))}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Itinerary lines</span>
                <textarea
                  name="itinerary"
                  rows="3"
                  value={tourForm.itinerary}
                  onChange={(e) => setTourForm((prev) => ({ ...prev, itinerary: e.target.value }))}
                  placeholder="Enter one itinerary item per line"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Included places (comma separated slugs)</span>
                <input
                  name="includedPlaces"
                  value={tourForm.includedPlaces}
                  onChange={(e) => setTourForm((prev) => ({ ...prev, includedPlaces: e.target.value }))}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Inclusions (comma separated)</span>
                <input
                  name="inclusions"
                  value={tourForm.inclusions}
                  onChange={(e) => setTourForm((prev) => ({ ...prev, inclusions: e.target.value }))}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Exclusions (comma separated)</span>
                <input
                  name="exclusions"
                  value={tourForm.exclusions}
                  onChange={(e) => setTourForm((prev) => ({ ...prev, exclusions: e.target.value }))}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <button className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-400">
                {editingTourSlug ? 'Update tour' : 'Create tour'}
              </button>
            </form>

            <div className="mt-8 space-y-3">
              {tours.map((tour) => (
                <div key={tour._id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">{tour.title}</p>
                    <p className="text-sm text-slate-600">{tour.slug}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleTourEdit(tour)}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTourDelete(tour.slug)}
                      className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
