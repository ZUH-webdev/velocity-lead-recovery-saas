'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Download, Search } from 'lucide-react';
import LeadDrawer from '../../../../components/dashboard/LeadDrawer';
import LeadsTable from '../../../../components/dashboard/LeadsTable';
import type { Lead, LeadStatus } from '../../../../lib/mock-data';
import { leads as allLeads } from '../../../../lib/mock-data';

type SortKey = 'name' | 'phone' | 'business' | 'status' | 'leadScore' | 'source' | 'createdAt';
type SortDir = 'asc' | 'desc';

const STATUS_OPTIONS: Array<LeadStatus | 'All'> = ['All', 'Qualified', 'Contacted', 'Booked', 'Lost'];
const PAGE_SIZE = 10;

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadList, setLeadList] = useState(allLeads);

  const filtered = useMemo(() => {
    let result = [...leadList];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) => l.name.toLowerCase().includes(q) || l.phone.includes(q),
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (dateFrom) {
      result = result.filter((l) => l.createdAt >= new Date(dateFrom).toISOString());
    }
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      result = result.filter((l) => l.createdAt <= end.toISOString());
    }

    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [leadList, search, statusFilter, dateFrom, dateTo, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === 'asc' ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />;
  };

  const handleExport = () => {
    const headers = ['Name', 'Phone', 'Business', 'Status', 'Lead Score', 'Source', 'Created At'];
    const rows = filtered.map((l) =>
      [l.name, l.phone, l.business, l.status, l.leadScore, l.source, l.createdAt].join(','),
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'velocity-leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (lead: Lead) => {
    setLeadList((prev) => prev.filter((l) => l.id !== lead.id));
    if (selectedLead?.id === lead.id) setSelectedLead(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a1a1aa]">
          Lead Management
        </p>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[#09090b]">Leads</h1>
        <p className="mt-1 text-sm text-[#71717a]">All recovered opportunities across your pipeline</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a1a1aa]" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-[#e4e4e7] bg-white py-[9px] pl-9 pr-3 text-[13px] text-[#09090b] placeholder:text-[#a1a1aa] focus:border-[#c9a97a] focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as LeadStatus | 'All');
              setPage(1);
            }}
            className="min-w-[140px] cursor-pointer rounded-lg border border-[#e4e4e7] bg-white px-3 py-[9px] text-[13px] text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Statuses' : s}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="cursor-pointer rounded-lg border border-[#e4e4e7] bg-white px-3 py-[9px] text-[13px] text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
          />
          <span className="text-[13px] text-[#a1a1aa]">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="cursor-pointer rounded-lg border border-[#e4e4e7] bg-white px-3 py-[9px] text-[13px] text-[#09090b] focus:border-[#c9a97a] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 self-start rounded-lg border border-[#09090b] bg-[#09090b] px-4 py-[9px] text-[13px] font-semibold text-white transition hover:bg-[#1c1c1e] lg:self-auto"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e4e4e7] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f4f4f5] px-5 py-3.5">
          <p className="text-[13px] text-[#71717a]">
            Showing <strong className="text-[#09090b]">{filtered.length}</strong> leads
          </p>
          <div className="flex flex-wrap gap-1">
            {(['name', 'phone', 'business', 'status', 'leadScore', 'source', 'createdAt'] as SortKey[]).map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => toggleSort(col)}
                className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] transition ${
                  sortKey === col
                    ? 'border-[#e4e4e7] bg-[#f4f4f5] text-[#09090b]'
                    : 'border-transparent text-[#a1a1aa] hover:text-[#c9a97a]'
                }`}
              >
                {col.replace(/([A-Z])/g, ' $1').trim()} <SortIcon col={col} />
              </button>
            ))}
          </div>
        </div>

        <div className="px-5">
          <LeadsTable
            leads={paginated}
            showBusiness
            showSource
            showCreatedAt
            onView={setSelectedLead}
            onDelete={handleDelete}
          />
        </div>

        <div className="flex items-center justify-between border-t border-[#f4f4f5] px-5 py-3.5">
          <p className="text-xs text-[#a1a1aa]">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-[#e4e4e7] bg-white px-3.5 py-1.5 text-xs font-medium text-[#09090b] hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:text-[#a1a1aa] disabled:hover:bg-white"
            >
              ← Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-[#e4e4e7] bg-white px-3.5 py-1.5 text-xs font-medium text-[#09090b] hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:text-[#a1a1aa] disabled:hover:bg-white"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}
