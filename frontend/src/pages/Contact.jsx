import { useState } from 'react';
import usePageMeta from '../hooks/usePageMeta';
import api from '../services/api';
import Alert from '../components/Alert';

function Contact() {
  usePageMeta('Contact | GB Tourism', 'Contact GB Tourism for tour support, inquiries, and local travel advice in Gilgit-Baltistan.');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDates: '',
    numberOfPeople: 1,
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setStatus({ type: 'error', message: 'Name, email, and phone are required.' });
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
      await api.post('/api/inquiries', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredDates: formData.preferredDates,
        numberOfPeople: formData.numberOfPeople,
        message: formData.message,
      });
      setStatus({ type: 'success', message: 'Message sent. We will be in touch shortly.' });
      setFormData({ name: '', email: '', phone: '', preferredDates: '', numberOfPeople: 1, message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to send message. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">Contact us</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Reach out for tour help, booking questions, or local travel advice across Gilgit-Baltistan.
        </p>
      </div>

      <div className="grid gap-10 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <Alert type={status.type} message={status.message} />
          <form onSubmit={handleSubmit} className="space-y-6">
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
              {submitting ? 'Sending...' : 'Send message'}
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-sm">
          <h2 className="text-3xl font-semibold">Office information</h2>
          <div className="mt-6 space-y-5 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white">Address</p>
              <p>Karimabad, Hunza District, Gilgit-Baltistan</p>
            </div>
            <div>
              <p className="font-semibold text-white">Email</p>
              <p>info@gb-tourism.com</p>
            </div>
            <div>
              <p className="font-semibold text-white">Phone</p>
              <p>+92 300 123 4567</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
