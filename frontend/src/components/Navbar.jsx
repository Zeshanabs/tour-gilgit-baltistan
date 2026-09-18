import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-slate-950 text-white shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="text-xl font-bold tracking-wide">GB <span className="text-amber-300">JOURNEYS</span></NavLink>
          <p className="hidden border-l border-slate-700 pl-4 text-xs font-medium uppercase tracking-[0.12em] text-slate-300 md:block">Gilgit-Baltistan</p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-100 lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          <span className="text-2xl">{menuOpen ? '×' : '☰'}</span>
        </button>

        <nav className={`w-full transition-all duration-300 lg:static lg:block lg:w-auto ${menuOpen ? 'block' : 'hidden'}`}>
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-800 pt-4 lg:mt-0 lg:flex-row lg:border-none lg:pt-0">
            {[
              { path: '/', label: 'Home' },
              { path: '/destinations', label: 'Destinations' },
              { path: '/tours', label: 'Tours' },
              { path: '/about', label: 'About' },
              { path: '/contact', label: 'Contact' },
            ].map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition hover:bg-slate-800 ${
                    isActive ? 'bg-slate-800 text-amber-200' : 'text-slate-200'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/inquire"
              className={({ isActive }) =>
                `rounded-md bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 ${
                  isActive ? 'ring-2 ring-amber-200' : ''
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Inquire
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
