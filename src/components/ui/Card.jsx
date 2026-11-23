export function Card({ className = "", children, ...props }) {
  return <article data-slot="card" className={`rounded-xl border border-slate-700 bg-slate-900 p-6 text-slate-50 ${className}`} {...props}>{children}</article>;
}
