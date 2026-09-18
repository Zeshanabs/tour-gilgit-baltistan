function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-10 rounded-[2rem] bg-white/80 p-8 shadow-sm backdrop-blur-md sm:p-10">
      <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{subtitle}</p>
    </div>
  );
}

export default PageHeader;
