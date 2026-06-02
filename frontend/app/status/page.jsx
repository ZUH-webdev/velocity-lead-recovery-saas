import Link from 'next/link';
import { CircleCheckBig, ArrowLeft, Clock3 } from 'lucide-react';

const systems = [
  'Voice Automation Nodes (Vapi AI Integration Proxy)',
  'Omnichannel Messaging Routing (SMS & WhatsApp Pipelines)',
  'RAG Processing Engines (Vector Vector Embeddings & Document Ingestion)',
  'Authentication & Database Clusters (JWT Middleware & Session Caching)',
];

const incidentHistory = [
  { date: 'June 2, 2026', note: 'No operational interruptions or platform degradations reported.' },
  { date: 'June 1, 2026', note: 'No operational interruptions or platform degradations reported.' },
  { date: 'May 31, 2026', note: 'No operational interruptions or platform degradations reported.' },
];

export default function SystemStatusPage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-slate-100 to-zinc-200/50 min-h-screen w-full py-20 px-4 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[360px] bg-slate-200/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-8 md:p-10 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              Live Status
            </div>

            <h1 className="mt-4 text-xl font-medium tracking-tight text-slate-900">
              All Core Systems Operational
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              99.98% operational across the past 90 days.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {systems.map((system, index) => (
            <div
              key={system}
              className={`flex items-center justify-between gap-4 px-4 py-4 ${index !== systems.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{system}</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">No active degradation detected.</p>
              </div>

              <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Operational
              </span>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex items-center gap-2 text-slate-900 font-medium text-base">
            <Clock3 className="h-4 w-4 text-slate-500" />
            System Incident History
          </div>

          <div className="mt-4 space-y-3">
            {incidentHistory.map((entry) => (
              <article key={entry.date} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-medium text-slate-900">{entry.date}</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700 border border-emerald-100">
                    <CircleCheckBig className="h-3.5 w-3.5" />
                    Clear
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{entry.note}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}