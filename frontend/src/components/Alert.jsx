function Alert({ type = 'success', message }) {
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    error: 'bg-rose-100 border-rose-200 text-rose-800',
    info: 'bg-sky-100 border-sky-200 text-slate-900',
  };

  return (
    <div className={`rounded-3xl border px-6 py-5 ${styles[type] || styles.info}`}>
      {message}
    </div>
  );
}

export default Alert;
