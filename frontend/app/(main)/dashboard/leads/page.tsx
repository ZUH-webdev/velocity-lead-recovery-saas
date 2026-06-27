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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] py-2 pl-9 pr-3 text-sm text-white placeholder:text-[#555] focus:border-[#c9a97a] focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as LeadStatus | 'All');
              setPage(1);
            }}
            className="rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none"
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
            className="rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none"
          />
          <span className="text-[#888888]">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#c9a97a] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 self-start rounded-lg bg-[#c9a97a] px-4 py-2 text-sm font-medium text-black hover:opacity-90 lg:self-auto"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
        <div className="mb-3 flex flex-wrap gap-4 text-xs uppercase tracking-widest text-[#888888]">
          {(['name', 'phone', 'business', 'status', 'leadScore', 'source', 'createdAt'] as SortKey[]).map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => toggleSort(col)}
              className="hover:text-[#c9a97a]"
            >
              {col.replace(/([A-Z])/g, ' $1').trim()} <SortIcon col={col} />
            </button>
          ))}
        </div>
        <LeadsTable
          leads={paginated}
          showBusiness
          showSource
          showCreatedAt
          onView={setSelectedLead}
          onDelete={handleDelete}
        />

        <div className="mt-4 flex items-center justify-between border-t border-[#2a2a2a] pt-4">
          <p className="text-sm text-[#888888]">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-sm text-[#f5f5f5] hover:bg-[#111111] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-sm text-[#f5f5f5] hover:bg-[#111111] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}
