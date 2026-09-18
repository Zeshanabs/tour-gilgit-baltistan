import { useEffect, useState } from 'react';
import api from '../services/api';
import Alert from './Alert';

function InquiryForm({ selectedTour }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    packageId: selectedTour?._id || '',
    preferredDates: '',
    numberOfPeople: 1,
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedTour?._id) {
      setFormData((prev) => ({ ...prev, packageId: selectedTour._id }));
    }
  }, [selectedTour]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setStatus({ type: 'error', message: 'Name, email and phone are required.' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post('/api/inquiries', formData);
      setStatus({ type: 'success', message: 'Inquiry sent successfully! Our team will contact you soon.' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        packageId: selectedTour?._id || '',
        preferredDates: '',
        numberOfPeople: 1,
        message: '',
      });
    } catch (err) {
      setStatus({ type: 'error', message: 'Unable to send inquiry. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert type={status.type} message={status.message} />
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Name*</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Email*</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Phone*</span>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Preferred dates</span>
          <input
            type="text"
            name="preferredDates"
            value={formData.preferredDates}
            onChange={handleChange}
            placeholder="e.g. 2026-09-05 to 2026-09-12"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Number of people</span>
          <input
            type="number"
            name="numberOfPeople"
            min="1"
            value={formData.numberOfPeople}
            onChange={handleChange}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Tour package</span>
          <input
            type="text"
            name="packageId"
            value={selectedTour?.title || ''}
            disabled
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-slate-900">Message</span>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-full bg-amber-300 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? 'Sending...' : 'Send Inquiry'}
      </button>
    </form>
  );
}

export default InquiryForm;
