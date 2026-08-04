import type { ReactNode } from 'react';

export function LegalIntro({ children }: { children: ReactNode }) {
  return (
    <div
      className="mb-10 rounded-[10px] border border-[#e4e4e7] bg-[#fafafa] py-5 pl-5 pr-6"
      style={{ borderLeft: '3px solid #c9a97a' }}
    >
      <p className="m-0 text-[15px] leading-[1.7] text-[#3f3f46]">{children}</p>
    </div>
  );
}

export function LegalSection({
  number,
  title,
  icon,
  children,
}: {
  number?: string | number;
  title: string;
  icon?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center gap-2.5 border-b border-[#f4f4f5] pb-3">
        {icon ? <span className="text-base">{icon}</span> : null}
        {number ? (
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#c9a97a]">{number}.</span>
        ) : null}
        <h2 className="m-0 text-base font-bold tracking-[-0.2px] text-[#09090b]">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-sm leading-[1.75] text-[#3f3f46]">{children}</p>;
}

export function LegalHighlight({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-sm italic leading-[1.7] text-[#c9a97a]">{children}</p>;
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="mb-4 flex list-none flex-col gap-2 p-0">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 rounded-lg border border-[#f4f4f5] bg-[#fafafa] px-3.5 py-2.5 text-sm leading-[1.6] text-[#3f3f46]"
        >
          <span className="mt-px shrink-0 font-bold text-[#c9a97a]">→</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function LegalTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="mb-6 overflow-hidden rounded-[10px] border border-[#e4e4e7]">
      {rows.map(({ label, value }, i) => (
        <div key={i} className={`flex flex-wrap ${i < rows.length - 1 ? 'border-b border-[#f4f4f5]' : ''}`}>
          <div className="w-[180px] shrink-0 border-r border-[#f4f4f5] bg-[#fafafa] px-4 py-3 text-xs font-semibold uppercase tracking-[0.04em] text-[#a1a1aa]">
            {label}
          </div>
          <div className="min-w-[200px] flex-1 px-4 py-3 text-[13px] text-[#3f3f46]">{value}</div>
        </div>
      ))}
    </div>
  );
}

const statusStyles = {
  operational: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', label: 'Operational' },
  degraded: { bg: '#fffbeb', color: '#d97706', border: '#fde68a', label: 'Degraded' },
  outage: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'Outage' },
  maintenance: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', label: 'Maintenance' },
} as const;

export type ServiceStatus = keyof typeof statusStyles;

export function StatusBadge({ status }: { status: ServiceStatus }) {
  const s = statusStyles[status];
  return (
    <span
      className="inline-flex items-center gap-[5px] rounded-[20px] border px-2.5 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}
