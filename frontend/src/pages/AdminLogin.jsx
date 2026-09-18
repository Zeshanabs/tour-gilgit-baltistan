import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Alert from '../components/Alert';
import usePageMeta from '../hooks/usePageMeta';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  usePageMeta('Admin login | GB Tourism', 'Admin login for the GB Tourism content management dashboard.');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', formData);
      localStorage.setItem('gb_admin_token', data.token);
      navigate('/admin/dashboard');
    } catch (error) {
      setStatus({ type: 'error', message: 'Login failed. Check email and password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg rounded-[2rem] bg-white p-8 shadow-sm">
      <h1 className="text-4xl font-semibold text-slate-900">Admin login</h1>
      <p className="mt-3 text-slate-600">Enter your admin credentials to manage inquiries, places, and tours.</p>
      <div className="mt-8 space-y-6">
        <Alert type={status.type} message={status.message} />
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Email</span>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Password</span>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;
