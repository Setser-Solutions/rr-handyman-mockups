'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Inbox,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  Printer,
  RefreshCw,
  Search,
  Star,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { BUSINESS } from '@/lib/business-info';
import { cn } from '@/lib/utils';

// ----- Types -----

type DesignKey = 'modern' | 'portfolio' | 'trusted';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string | null;
  message: string | null;
  design: string | null;
  estimate: string | null;
  contacted: boolean | null;
  contactedAt: string | null;
  starred: boolean | null;
  adminNote: string | null;
  createdAt: string;
}

interface FeedbackItem {
  id: string;
  design: string;
  rating: number;
  notes: string;
  createdAt: string;
}

interface LeadsResponse {
  ok: boolean;
  leads?: Lead[];
  count?: number;
  error?: string;
}

interface FeedbackResponse {
  ok: boolean;
  feedback?: FeedbackItem[];
  count?: number;
  error?: string;
}

type ServiceFilter = 'all' | 'Plumbing' | 'Carpentry' | 'Power Washing' | 'Multiple';
type DesignFilter = 'all' | DesignKey;

// ----- Design metadata (accents match the public site) -----

const DESIGN_META: Record<DesignKey, { label: string; dot: string; badge: string }> = {
  modern: {
    label: 'Modern',
    dot: 'bg-amber-500',
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  portfolio: {
    label: 'Portfolio',
    dot: 'bg-emerald-500',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  trusted: {
    label: 'Trusted',
    dot: 'bg-orange-500',
    badge: 'border-orange-200 bg-orange-50 text-orange-700',
  },
};

function getDesignMeta(design: string | null | undefined) {
  if (design && design in DESIGN_META) {
    return DESIGN_META[design as DesignKey];
  }
  return null;
}

// ----- Helpers -----

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : dateFormatter.format(d);
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

function normalizeService(s: string | null | undefined): string {
  if (!s) return '—';
  if (s === 'Plumbing' || s === 'Carpentry' || s === 'Power Washing') return s;
  return 'Multiple / Not sure';
}

function telHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.startsWith('+') ? `tel:${cleaned}` : `tel:+1${cleaned.replace(/\D/g, '')}`;
}

function csvEscape(value: unknown): string {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function downloadCsv(filename: string, rows: string[][]): void {
  const csv = rows.map((r) => r.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function todayStamp(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function truncate(text: string, max = 60): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

// ----- Small presentational components -----

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  children,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}) {
  return (
    <Card className="border-stone-200 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <Icon className="size-4 text-stone-400" />
        </div>
        <p className="mt-2 text-3xl font-bold tracking-tight text-stone-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
        {children}
      </CardContent>
    </Card>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  label,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-stone-900 bg-stone-900 text-white'
          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100',
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-200 bg-white/60 px-4 py-16 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-full bg-stone-100 text-stone-400">
        <Icon className="size-7" />
      </div>
      <h3 className="text-base font-semibold text-stone-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-stone-500">{body}</p>
    </div>
  );
}

function StarRow({ rating, size = 'size-3.5' }: { rating: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            size,
            s <= rating ? 'fill-amber-500 text-amber-500' : 'fill-stone-100 text-stone-200',
          )}
        />
      ))}
    </span>
  );
}

// ----- Main page -----

export default function AdminLeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [tab, setTab] = useState<'leads' | 'feedback'>('leads');

  // Lead detail dialog state
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [detailNote, setDetailNote] = useState('');
  const [detailSaving, setDetailSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [designFilter, setDesignFilter] = useState<DesignFilter>('all');
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('all');
  const [starredOnly, setStarredOnly] = useState(false);

  // Date-range filter state (optional; null = no date filter)
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const inFlightRef = useRef(false);
  // Track the set of lead IDs we've already seen, so auto-refresh can
  // detect NEW leads and fire a notification toast.
  const knownLeadIdsRef = useRef<Set<string> | null>(null);

  const fetchData = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setRefreshing(true);
    try {
      const [leadsRes, fbRes] = await Promise.all([
        fetch('/api/leads', { cache: 'no-store' }),
        fetch('/api/feedback/list', { cache: 'no-store' }),
      ]);

      // If leads API returns 401, the admin cookie expired — bounce to login.
      if (leadsRes.status === 401) {
        window.location.href = '/admin/login';
        return;
      }

      const leadsJson = (await leadsRes.json().catch(() => ({}))) as LeadsResponse;
      const fbJson = (await fbRes.json().catch(() => ({}))) as FeedbackResponse;

      if (!leadsRes.ok || !leadsJson.ok) {
        throw new Error(leadsJson.error ?? 'Failed to fetch leads');
      }
      if (!fbRes.ok || !fbJson.ok) {
        throw new Error(fbJson.error ?? 'Failed to fetch feedback');
      }

      const newLeads = leadsJson.leads ?? [];
      // Detect newly-arrived leads (IDs we haven't seen before). On the
      // first fetch we just seed the set without notifying. On subsequent
      // fetches (auto-refresh), new IDs trigger a toast.
      const incomingIds = new Set(newLeads.map((l) => l.id));
      if (knownLeadIdsRef.current === null) {
        // First load — seed the set silently.
        knownLeadIdsRef.current = incomingIds;
      } else {
        const fresh = newLeads.filter((l) => !knownLeadIdsRef.current!.has(l.id));
        if (fresh.length > 0) {
          // Update the known set
          for (const l of fresh) knownLeadIdsRef.current.add(l.id);
          // Fire a toast for each new lead (cap at 3 to avoid spam)
          fresh.slice(0, 3).forEach((l) => {
            toast.success('New lead received!', {
              description: `${l.name} · ${l.phone}${l.service ? ` · ${l.service}` : ''}`,
            });
          });
          if (fresh.length > 3) {
            toast.info(`${fresh.length - 3} more new lead${fresh.length - 3 === 1 ? '' : 's'}…`);
          }
        }
      }

      setLeads(newLeads);
      setFeedback(fbJson.feedback ?? []);
      setError(null);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
      setRefreshing(false);
      inFlightRef.current = false;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Auto-refresh every 30s when enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      void fetchData();
    }, 30_000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchData]);

  // ===== Lead management actions =====
  const toggleContacted = useCallback(async (id: string, next: boolean) => {
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, contacted: next, contactedAt: next ? new Date().toISOString() : null }
          : l,
      ),
    );
    // Sync the detail dialog if it's open for this lead
    setDetailLead((prev) =>
      prev && prev.id === id
        ? { ...prev, contacted: next, contactedAt: next ? new Date().toISOString() : null }
        : prev,
    );
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacted: next }),
      });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) {
        // Revert on failure
        setLeads((prev) =>
          prev.map((l) =>
            l.id === id
              ? { ...l, contacted: !next, contactedAt: !next ? null : l.contactedAt }
              : l,
          ),
        );
      }
    } catch {
      // network error — revert
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, contacted: !next, contactedAt: !next ? null : l.contactedAt }
            : l,
        ),
      );
    }
  }, []);

  // Toggle the star/important flag on a lead.
  const toggleStarred = useCallback(async (id: string, next: boolean) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, starred: next } : l)),
    );
    setDetailLead((prev) =>
      prev && prev.id === id ? { ...prev, starred: next } : prev,
    );
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starred: next }),
      });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, starred: !next } : l)),
        );
      }
    } catch {
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, starred: !next } : l)),
      );
    }
  }, []);

  const deleteLead = useCallback(
    async (id: string) => {
      // Remove optimistically
      const snapshot = leads;
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setConfirmDeleteId(null);
      setDetailLead(null);
      try {
        const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        if (!res.ok) {
          setLeads(snapshot);
        }
      } catch {
        setLeads(snapshot);
      }
    },
    [leads],
  );

  const saveAdminNote = useCallback(async () => {
    if (!detailLead) return;
    setDetailSaving(true);
    try {
      const res = await fetch(`/api/leads/${detailLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNote: detailNote }),
      });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok && data.lead) {
        // Update local state with the server's response
        setLeads((prev) =>
          prev.map((l) => (l.id === data.lead.id ? { ...l, ...data.lead } : l)),
        );
        setDetailLead((prev) => (prev && prev.id === data.lead.id ? { ...prev, ...data.lead } : prev));
      }
    } finally {
      setDetailSaving(false);
    }
  }, [detailLead, detailNote]);

  // Open detail dialog: set the lead + seed the note field
  const openDetail = useCallback((lead: Lead) => {
    setDetailLead(lead);
    setDetailNote(lead.adminNote ?? '');
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }, []);

  // Derived stats
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const byDesign: Record<DesignKey, number> = { modern: 0, portfolio: 0, trusted: 0 };
    for (const l of leads) {
      if (l.design && l.design in byDesign) {
        byDesign[l.design as DesignKey] += 1;
      }
    }
    const contactedCount = leads.filter((l) => l.contacted).length;
    const starredCount = leads.filter((l) => l.starred).length;
    const conversionRate = totalLeads > 0 ? Math.round((contactedCount / totalLeads) * 100) : 0;
    const totalFeedback = feedback.length;
    const avgRating =
      feedback.length === 0
        ? 0
        : feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.length;

    // Helper: compute leads-per-day for the last N days.
    const computeDays = (n: number): { label: string; count: number; date: Date }[] => {
      const out: { label: string; count: number; date: Date }[] = [];
      const now = new Date();
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        const next = new Date(d);
        next.setDate(next.getDate() + 1);
        const count = leads.filter((l) => {
          const t = new Date(l.createdAt);
          return t >= d && t < next;
        }).length;
        out.push({
          label: d.toLocaleDateString('en-US', { weekday: 'short' }),
          count,
          date: d,
        });
      }
      return out;
    };

    const days7 = computeDays(7);
    const days30 = computeDays(30);
    return {
      totalLeads,
      byDesign,
      contactedCount,
      starredCount,
      conversionRate,
      totalFeedback,
      avgRating,
      days7,
      days30,
    };
  }, [leads, feedback]);

  // Chart range state (7d / 30d toggle)
  const [chartRange, setChartRange] = useState<'7d' | '30d'>('7d');

  // Filtered leads (search + design + service + date-range + starred)
  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTime = dateFrom ? new Date(dateFrom + 'T00:00:00').getTime() : null;
    const toTime = dateTo ? new Date(dateTo + 'T23:59:59').getTime() : null;
    return leads.filter((l) => {
      if (starredOnly && !l.starred) return false;
      if (designFilter !== 'all' && l.design !== designFilter) return false;
      if (serviceFilter !== 'all') {
        const ns = normalizeService(l.service);
        if (serviceFilter === 'Multiple') {
          if (ns !== 'Multiple / Not sure') return false;
        } else if (ns !== serviceFilter) return false;
      }
      if (q) {
        const hay = `${l.name} ${l.phone} ${l.email ?? ''} ${l.message ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (fromTime || toTime) {
        const t = new Date(l.createdAt).getTime();
        if (fromTime && t < fromTime) return false;
        if (toTime && t > toTime) return false;
      }
      return true;
    });
  }, [leads, search, designFilter, serviceFilter, dateFrom, dateTo, starredOnly]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, designFilter, serviceFilter, dateFrom, dateTo, starredOnly]);

  // Paginate the filtered leads
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedLeads = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, safePage]);

  // Grouped feedback by design
  const groupedFeedback = useMemo(() => {
    const groups: Record<DesignKey, FeedbackItem[]> = {
      modern: [],
      portfolio: [],
      trusted: [],
    };
    for (const f of feedback) {
      if (f.design in groups) {
        groups[f.design as DesignKey].push(f);
      }
    }
    return groups;
  }, [feedback]);

  // CSV exports
  const exportLeadsCsv = useCallback(() => {
    const rows: string[][] = [
      ['Date', 'Name', 'Phone', 'Email', 'Service', 'Design', 'Estimate', 'Message'],
    ];
    for (const l of filteredLeads) {
      rows.push([
        formatDateTime(l.createdAt),
        l.name,
        l.phone,
        l.email ?? '',
        l.service ?? '',
        l.design ?? '',
        l.estimate ?? '',
        l.message ?? '',
      ]);
    }
    downloadCsv(`rr-handyman-leads-${todayStamp()}.csv`, rows);
  }, [filteredLeads]);

  const exportFeedbackCsv = useCallback(() => {
    const rows: string[][] = [['Date', 'Design', 'Rating', 'Notes']];
    for (const f of feedback) {
      rows.push([
        formatDateTime(f.createdAt),
        f.design,
        String(f.rating),
        f.notes,
      ]);
    }
    downloadCsv(`rr-handyman-feedback-${todayStamp()}.csv`, rows);
  }, [feedback]);

  const hasLeads = stats.totalLeads > 0;
  const hasFeedback = stats.totalFeedback > 0;

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-stone-900 text-sm font-bold text-amber-400">
              R&amp;R
            </div>
            <div>
              <h1 className="text-xl font-semibold leading-tight text-stone-900">
                R&amp;R Handyman — Admin
              </h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-stone-500">
                <Clock className="size-3.5" />
                {lastRefresh ? (
                  <span>
                    Last refreshed{' '}
                    <span className="font-medium text-stone-700">
                      {formatDateTime(lastRefresh.toISOString())}
                    </span>
                  </span>
                ) : loading ? (
                  <span>Loading…</span>
                ) : (
                  <span>Never</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                aria-label="Toggle auto-refresh every 30 seconds"
              />
              <label
                htmlFor="auto-refresh"
                className="cursor-pointer select-none text-xs font-medium text-stone-600"
              >
                Auto · 30s
              </label>
            </div>
            <Button
              onClick={() => void fetchData()}
              variant="outline"
              size="sm"
              disabled={refreshing}
              aria-label="Refresh data now"
              className="border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
            >
              <RefreshCw className={cn('size-4', refreshing && 'animate-spin')} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            >
              <Link href="/" aria-label="Back to public site">
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">View site</span>
              </Link>
            </Button>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-stone-600 hover:bg-red-50 hover:text-red-700"
              title="Sign out of admin"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Error state */}
        {error && !loading && (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertCircle className="size-4 text-red-600" />
            <AlertTitle className="text-red-800">Couldn&apos;t load dashboard data</AlertTitle>
            <AlertDescription className="text-red-700">
              <p>{error}</p>
              <Button
                onClick={() => void fetchData()}
                variant="outline"
                size="sm"
                className="mt-2 border-red-300 bg-white text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="size-4" />
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats row */}
        <section aria-label="Quick stats" className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {loading && stats.totalLeads === 0 && !error ? (
            <>
              {[0, 1, 2, 3].map((i) => (
                <Card key={i} className="border-stone-200 bg-white shadow-sm">
                  <CardContent className="space-y-3 p-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <StatCard
                label="Total leads"
                value={String(stats.totalLeads)}
                hint="last 50 submissions"
                icon={Inbox}
              />

              <Card className="border-stone-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-stone-500">Leads by design</p>
                    <TrendingUp className="size-4 text-stone-400" />
                  </div>
                  <div className="mt-3 space-y-2">
                    {(Object.keys(DESIGN_META) as DesignKey[]).map((k) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-stone-700">
                          <span
                            className={cn('size-2.5 rounded-full', DESIGN_META[k].dot)}
                            aria-hidden
                          />
                          {DESIGN_META[k].label}
                        </span>
                        <span className="text-sm font-semibold text-stone-900">
                          {stats.byDesign[k]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <StatCard
                label="Avg feedback rating"
                value={stats.avgRating.toFixed(1)}
                hint={`across ${stats.totalFeedback} notes`}
                icon={Star}
              >
                <span className="mt-2 inline-flex items-center gap-1 text-amber-500">
                  <Star className="size-4 fill-amber-500" />
                  <span className="text-xs font-medium text-stone-500">
                    {stats.avgRating.toFixed(1)} / 5
                  </span>
                </span>
              </StatCard>

              <StatCard
                label="Feedback notes"
                value={String(stats.totalFeedback)}
                hint="last 100 notes"
                icon={MessageSquare}
              />

              {/* Contacted + conversion rate + leads-over-time chart */}
              <Card className="border-stone-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-stone-500">Contacted & conversion</p>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setChartRange('7d')}
                        aria-pressed={chartRange === '7d'}
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors',
                          chartRange === '7d'
                            ? 'bg-stone-900 text-white'
                            : 'text-stone-400 hover:text-stone-700',
                        )}
                      >
                        7d
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartRange('30d')}
                        aria-pressed={chartRange === '30d'}
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors',
                          chartRange === '30d'
                            ? 'bg-stone-900 text-white'
                            : 'text-stone-400 hover:text-stone-700',
                        )}
                      >
                        30d
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline gap-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-stone-900">
                        {stats.contactedCount}
                      </span>
                      <span className="text-xs text-stone-400">
                        of {stats.totalLeads}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5">
                      <CheckCircle2
                        className={cn(
                          'size-3',
                          stats.contactedCount > 0 ? 'text-emerald-600' : 'text-stone-300',
                        )}
                      />
                      <span className="text-xs font-semibold text-emerald-700">
                        {stats.conversionRate}% converted
                      </span>
                    </div>
                  </div>

                  {/* Leads-over-time bar chart */}
                  <div
                    className="mt-4 flex items-end justify-between gap-px"
                    aria-label={`Leads in the last ${chartRange === '7d' ? '7' : '30'} days`}
                  >
                    {(chartRange === '7d' ? stats.days7 : stats.days30).map((d, i) => {
                      const days = chartRange === '7d' ? stats.days7 : stats.days30;
                      const max = Math.max(1, ...days.map((x) => x.count));
                      const h = Math.max(3, Math.round((d.count / max) * 48));
                      // Show date label only on every Nth bar to avoid crowding
                      const showLabel =
                        chartRange === '7d' ||
                        i % 5 === 0 ||
                        i === days.length - 1;
                      return (
                        <div
                          key={i}
                          className="flex flex-1 flex-col items-center gap-0.5"
                          title={`${d.count} lead${d.count === 1 ? '' : 's'} on ${d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                        >
                          <div
                            className={cn(
                              'w-full rounded-sm transition-all',
                              d.count > 0
                                ? 'bg-amber-400 hover:bg-amber-500'
                                : 'bg-stone-100 hover:bg-stone-200',
                            )}
                            style={{ height: `${h}px` }}
                          />
                          {showLabel && (
                            <span className="text-[8px] text-stone-400">
                              {d.date.toLocaleDateString('en-US', { day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </section>

        {/* Tabs */}
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as 'leads' | 'feedback')}
          className="space-y-4"
        >
          <TabsList className="bg-stone-200/70 p-1">
            <TabsTrigger
              value="leads"
              className="gap-1.5 text-stone-600 data-[state=active]:bg-white data-[state=active]:text-stone-900"
            >
              <Inbox className="size-4" />
              Leads
              <Badge
                variant="secondary"
                className="ml-1 bg-stone-200 text-stone-700"
                aria-label={`${stats.totalLeads} total leads`}
              >
                {stats.totalLeads}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="gap-1.5 text-stone-600 data-[state=active]:bg-white data-[state=active]:text-stone-900"
            >
              <MessageSquare className="size-4" />
              Feedback
              <Badge
                variant="secondary"
                className="ml-1 bg-stone-200 text-stone-700"
                aria-label={`${stats.totalFeedback} total notes`}
              >
                {stats.totalFeedback}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Leads tab */}
          <TabsContent value="leads" className="space-y-4">
            {!hasLeads && !loading ? (
              <Card className="border-stone-200 bg-white shadow-sm">
                <CardContent className="p-0">
                  <EmptyState
                    icon={Inbox}
                    title="No leads yet"
                    body="Share your site link to start collecting quotes. New submissions will appear here automatically (auto-refresh is on by default)."
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="border-stone-200 bg-white shadow-sm">
                <CardHeader className="border-b border-stone-100">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base text-stone-900">
                        <Filter className="size-4 text-stone-500" />
                        Filter leads
                      </CardTitle>
                      <p className="mt-1 text-xs text-stone-500">
                        {filteredLeads.length > pageSize ? (
                          <>
                            Showing{' '}
                            <span className="font-medium text-stone-700">
                              {(safePage - 1) * pageSize + 1}–
                              {Math.min(safePage * pageSize, filteredLeads.length)}
                            </span>{' '}
                            of <span className="font-medium text-stone-700">{filteredLeads.length}</span>
                            {filteredLeads.length !== stats.totalLeads && ' (filtered)'}
                          </>
                        ) : (
                          <>
                            Showing{' '}
                            <span className="font-medium text-stone-700">
                              {filteredLeads.length}
                            </span>{' '}
                            of {stats.totalLeads} leads
                            {filteredLeads.length !== stats.totalLeads && ' (filtered)'}
                          </>
                        )}
                      </p>
                    </div>
                    <Button
                      onClick={exportLeadsCsv}
                      size="sm"
                      disabled={filteredLeads.length === 0}
                      className="bg-stone-900 text-white hover:bg-stone-800"
                    >
                      <Download className="size-4" />
                      Export CSV
                    </Button>
                  </div>

                  <div className="relative mt-3">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name, phone, email, message…"
                      aria-label="Search leads"
                      className="border-stone-200 bg-stone-50 pl-9 focus:bg-white"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Starred filter toggle */}
                    <FilterPill
                      active={starredOnly}
                      onClick={() => setStarredOnly((v) => !v)}
                      label="Show only starred leads"
                    >
                      <Star className={cn('size-3', starredOnly && 'fill-amber-400 text-amber-500')} />
                      {starredOnly ? 'Starred only' : 'Starred'}
                    </FilterPill>
                    <span className="mx-1 self-center text-xs font-medium text-stone-500">
                      Design:
                    </span>
                    <FilterPill
                      active={designFilter === 'all'}
                      onClick={() => setDesignFilter('all')}
                      label="All designs"
                    >
                      All
                    </FilterPill>
                    {(Object.keys(DESIGN_META) as DesignKey[]).map((k) => (
                      <FilterPill
                        key={k}
                        active={designFilter === k}
                        onClick={() => setDesignFilter(k)}
                        label={`Filter to ${DESIGN_META[k].label} design`}
                      >
                        <span
                          className={cn('size-2 rounded-full', DESIGN_META[k].dot)}
                          aria-hidden
                        />
                        {DESIGN_META[k].label}
                      </FilterPill>
                    ))}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="mr-1 self-center text-xs font-medium text-stone-500">
                      Service:
                    </span>
                    {(
                      ['all', 'Plumbing', 'Carpentry', 'Power Washing', 'Multiple'] as const
                    ).map((k) => (
                      <FilterPill
                        key={k}
                        active={serviceFilter === k}
                        onClick={() => setServiceFilter(k)}
                        label={k === 'all' ? 'All services' : `Filter to ${k}`}
                      >
                        {k === 'all' ? 'All' : k}
                      </FilterPill>
                    ))}
                  </div>

                  {/* Date-range filter */}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="mr-1 self-center text-xs font-medium text-stone-500">
                      Date:
                    </span>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      aria-label="Filter from this date"
                      className="h-8 rounded-md border border-stone-200 bg-stone-50 px-2 text-xs text-stone-700 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1"
                    />
                    <span className="text-xs text-stone-400">to</span>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      aria-label="Filter to this date"
                      className="h-8 rounded-md border border-stone-200 bg-stone-50 px-2 text-xs text-stone-700 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1"
                    />
                    {(dateFrom || dateTo) && (
                      <button
                        type="button"
                        onClick={() => { setDateFrom(''); setDateTo(''); }}
                        className="inline-flex items-center gap-1 rounded-full border border-stone-200 px-2 py-1 text-[11px] text-stone-500 hover:border-stone-400 hover:text-stone-700"
                      >
                        <X className="size-3" />
                        Clear dates
                      </button>
                    )}
                  </div>

                  {/* Active filters summary + clear all */}
                  {(search || designFilter !== 'all' || serviceFilter !== 'all' || dateFrom || dateTo || starredOnly) && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                      <span>
                        Showing {filteredLeads.length} of {stats.totalLeads} leads
                        {filteredLeads.length !== stats.totalLeads && ` (filtered)`}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setSearch(''); setDesignFilter('all'); setServiceFilter('all'); setDateFrom(''); setDateTo(''); setStarredOnly(false); }}
                        className="inline-flex items-center gap-1 rounded-full border border-stone-200 px-2 py-0.5 text-[11px] text-stone-500 hover:border-stone-400 hover:text-stone-700"
                      >
                        <X className="size-3" />
                        Clear all
                      </button>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-0">
                  {loading ? (
                    <div className="divide-y divide-stone-100">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3">
                          <Skeleton className="h-8 w-28" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-4 flex-1 max-w-[200px]" />
                        </div>
                      ))}
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <EmptyState
                      icon={Search}
                      title="No leads match your filters"
                      body="Try clearing the search box or selecting All for design and service."
                    />
                  ) : (
                    <div className="scrollbar-thin max-h-[600px] overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10 bg-stone-50">
                          <tr className="border-b border-stone-200">
                            <th
                              scope="col"
                              className="whitespace-nowrap px-4 py-3 text-left font-medium text-stone-600"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-4 py-3 text-left font-medium text-stone-600"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-4 py-3 text-left font-medium text-stone-600"
                            >
                              Phone
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-4 py-3 text-left font-medium text-stone-600"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-4 py-3 text-left font-medium text-stone-600"
                            >
                              Service
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-4 py-3 text-left font-medium text-stone-600"
                            >
                              Design
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left font-medium text-stone-600"
                            >
                              Message
                            </th>
                            <th scope="col" className="whitespace-nowrap px-4 py-3 text-right font-medium text-stone-600">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedLeads.map((lead) => {
                            const meta = getDesignMeta(lead.design);
                            return (
                              <tr
                                key={lead.id}
                                onClick={() => openDetail(lead)}
                                className="cursor-pointer border-b border-stone-100 transition-colors hover:bg-amber-50/40"
                              >
                                <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                                  <div className="font-medium text-stone-700">
                                    {formatDateTime(lead.createdAt)}
                                  </div>
                                  <div className="text-xs text-stone-400">
                                    {relativeTime(lead.createdAt)}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-900">
                                  <div className="flex items-center gap-2">
                                    {lead.starred && (
                                      <Star
                                        className="size-3.5 fill-amber-400 text-amber-500"
                                        aria-label="Starred"
                                      />
                                    )}
                                    {lead.name}
                                    {lead.contacted && (
                                      <CheckCircle2
                                        className="size-3.5 text-emerald-500"
                                        aria-label="Contacted"
                                      />
                                    )}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                  <a
                                    href={telHref(lead.phone)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-stone-700 transition-colors hover:text-amber-700 hover:underline"
                                  >
                                    <Phone className="size-3.5 text-stone-400" />
                                    {lead.phone}
                                  </a>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                  {lead.email ? (
                                    <a
                                      href={`mailto:${lead.email}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 text-stone-700 transition-colors hover:text-amber-700 hover:underline"
                                    >
                                      <Mail className="size-3.5 text-stone-400" />
                                      <span className="truncate max-w-[180px]">
                                        {lead.email}
                                      </span>
                                    </a>
                                  ) : (
                                    <span className="text-stone-400">—</span>
                                  )}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                                  {normalizeService(lead.service)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                  {meta ? (
                                    <Badge
                                      variant="outline"
                                      className={cn('gap-1.5', meta.badge)}
                                    >
                                      <span
                                        className={cn('size-1.5 rounded-full', meta.dot)}
                                        aria-hidden
                                      />
                                      {meta.label}
                                    </Badge>
                                  ) : (
                                    <span className="text-stone-400">—</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-stone-600">
                                  {lead.message ? (
                                    <span
                                      title={lead.message}
                                      className="block max-w-xs truncate"
                                    >
                                      {truncate(lead.message)}
                                    </span>
                                  ) : lead.estimate ? (
                                    <span className="text-xs text-stone-500">
                                      Est: {lead.estimate}
                                    </span>
                                  ) : (
                                    <span className="text-stone-400">—</span>
                                  )}
                                </td>
                                {/* Actions column */}
                                <td className="whitespace-nowrap px-4 py-3">
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        void toggleStarred(lead.id, !lead.starred);
                                      }}
                                      title={lead.starred ? 'Remove star' : 'Star this lead'}
                                      aria-label={lead.starred ? 'Remove star' : 'Star this lead'}
                                      className={cn(
                                        'rounded p-1.5 transition-colors',
                                        lead.starred
                                          ? 'text-amber-500 hover:bg-amber-50'
                                          : 'text-stone-300 hover:bg-stone-100 hover:text-amber-500',
                                      )}
                                    >
                                      <Star className={cn('size-4', lead.starred && 'fill-amber-400')} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        void toggleContacted(lead.id, !lead.contacted);
                                      }}
                                      title={lead.contacted ? 'Mark as not contacted' : 'Mark as contacted'}
                                      aria-label={lead.contacted ? 'Mark as not contacted' : 'Mark as contacted'}
                                      className={cn(
                                        'rounded p-1.5 transition-colors',
                                        lead.contacted
                                          ? 'text-emerald-600 hover:bg-emerald-50'
                                          : 'text-stone-400 hover:bg-stone-100 hover:text-stone-700',
                                      )}
                                    >
                                      <CheckCircle2 className="size-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmDeleteId(lead.id);
                                      }}
                                      title="Delete lead"
                                      aria-label="Delete lead"
                                      className="rounded p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                      <Trash2 className="size-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination controls */}
                  {filteredLeads.length > pageSize && (
                    <div className="flex items-center justify-between gap-3 border-t border-stone-100 px-4 py-3">
                      <p className="text-xs text-stone-500">
                        Page <span className="font-medium text-stone-700">{safePage}</span> of{' '}
                        <span className="font-medium text-stone-700">{totalPages}</span>
                        <span className="hidden sm:inline">
                          {' '}· {filteredLeads.length} leads total
                        </span>
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={safePage <= 1}
                          className="inline-flex h-8 items-center gap-1 rounded-md border border-stone-200 px-3 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="size-3.5" />
                          <span className="hidden sm:inline">Prev</span>
                        </button>
                        {/* Page number pills (show up to 5 around current) */}
                        {Array.from({ length: totalPages }).map((_, i) => {
                          const p = i + 1;
                          // Show first, last, and ±1 around current
                          if (
                            p !== 1 &&
                            p !== totalPages &&
                            (p < safePage - 1 || p > safePage + 1)
                          ) {
                            if (p === 2 || p === totalPages - 1) {
                              return (
                                <span key={p} className="px-1 text-xs text-stone-300">
                                  …
                                </span>
                              );
                            }
                            return null;
                          }
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setCurrentPage(p)}
                              aria-current={p === safePage ? 'page' : undefined}
                              className={cn(
                                'inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-medium transition-colors',
                                p === safePage
                                  ? 'border-stone-900 bg-stone-900 text-white'
                                  : 'border-stone-200 text-stone-700 hover:bg-stone-100',
                              )}
                            >
                              {p}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={safePage >= totalPages}
                          className="inline-flex h-8 items-center gap-1 rounded-md border border-stone-200 px-3 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                          aria-label="Next page"
                        >
                          <span className="hidden sm:inline">Next</span>
                          <ChevronRight className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Feedback tab */}
          <TabsContent value="feedback" className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-stone-600">
                <span className="font-medium text-stone-900">{stats.totalFeedback}</span> notes
                across{' '}
                {(Object.keys(DESIGN_META) as DesignKey[]).filter(
                  (k) => groupedFeedback[k].length > 0,
                ).length}{' '}
                of 3 designs
              </p>
              <Button
                onClick={exportFeedbackCsv}
                size="sm"
                disabled={!hasFeedback}
                className="bg-stone-900 text-white hover:bg-stone-800"
              >
                <Download className="size-4" />
                Export CSV
              </Button>
            </div>

            {loading ? (
              <div className="grid gap-4 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <Card key={i} className="border-stone-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-stone-100 pb-4">
                      <Skeleton className="h-5 w-28" />
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-3 px-6 py-4">
                        {Array.from({ length: 3 }).map((_, j) => (
                          <div key={j} className="space-y-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !hasFeedback ? (
              <Card className="border-stone-200 bg-white shadow-sm">
                <CardContent className="p-0">
                  <EmptyState
                    icon={MessageSquare}
                    title="No feedback yet"
                    body="Use the “Design Notes” button on the public site to leave a rating and notes for each mockup. Submissions appear here in real time."
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 lg:grid-cols-3">
                {(Object.keys(DESIGN_META) as DesignKey[]).map((k) => {
                  const items = groupedFeedback[k];
                  const meta = DESIGN_META[k];
                  return (
                    <Card key={k} className="flex flex-col border-stone-200 bg-white shadow-sm">
                      <CardHeader className="border-b border-stone-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-base text-stone-900">
                          <span
                            className={cn('size-2.5 rounded-full', meta.dot)}
                            aria-hidden
                          />
                          {meta.label}
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-stone-100 text-stone-600"
                          >
                            {items.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {items.length === 0 ? (
                          <p className="px-6 py-8 text-center text-sm text-stone-400">
                            No feedback for this design yet.
                          </p>
                        ) : (
                          <ul className="scrollbar-thin max-h-[400px] divide-y divide-stone-100 overflow-y-auto">
                            {items.map((f) => (
                              <li key={f.id} className="px-6 py-4">
                                <div className="mb-1.5 flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <StarRow rating={f.rating} />
                                    <span className="sr-only">
                                      {f.rating} out of 5 stars
                                    </span>
                                  </div>
                                  <span
                                    className="text-xs text-stone-400"
                                    title={formatDateTime(f.createdAt)}
                                  >
                                    {relativeTime(f.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed text-stone-700">
                                  {f.notes}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Sticky footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-stone-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {BUSINESS.brand}. Admin dashboard.
          </p>
          <Link
            href="/"
            className="underline-offset-2 hover:text-stone-900 hover:underline"
          >
            Back to public site →
          </Link>
        </div>
      </footer>

      {/* ===== Lead detail dialog ===== */}
      <Dialog open={!!detailLead} onOpenChange={(o) => { if (!o) setDetailLead(null); }}>
        <DialogContent className="max-w-lg">
          {detailLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 pr-8">
                  {detailLead.starred && (
                    <Star className="size-4 shrink-0 fill-amber-400 text-amber-500" aria-label="Starred" />
                  )}
                  <span className="truncate">{detailLead.name}</span>
                  {detailLead.contacted ? (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="mr-1 size-3" />
                      Contacted
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-stone-500">
                      Not contacted
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Submitted {formatDateTime(detailLead.createdAt)} ·{' '}
                  {relativeTime(detailLead.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Contact info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Phone</p>
                    <a
                      href={telHref(detailLead.phone)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-900 hover:text-amber-700"
                    >
                      <Phone className="size-3.5 text-stone-400" />
                      {detailLead.phone}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Email</p>
                    {detailLead.email ? (
                      <a
                        href={`mailto:${detailLead.email}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-900 hover:text-amber-700"
                      >
                        <Mail className="size-3.5 text-stone-400" />
                        <span className="truncate">{detailLead.email}</span>
                      </a>
                    ) : (
                      <span className="text-sm text-stone-400">—</span>
                    )}
                  </div>
                </div>

                {/* Service + Design + Estimate */}
                <div className="grid grid-cols-3 gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Service</p>
                    <p className="mt-0.5 text-stone-900">{normalizeService(detailLead.service)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Design</p>
                    <p className="mt-0.5 text-stone-900">
                      {getDesignMeta(detailLead.design)?.label ?? '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Estimate</p>
                    <p className="mt-0.5 text-stone-900">{detailLead.estimate ?? '—'}</p>
                  </div>
                </div>

                {/* Message */}
                {detailLead.message && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Message</p>
                    <p className="rounded-lg border border-stone-200 bg-white p-3 text-sm text-stone-700 whitespace-pre-wrap">
                      {detailLead.message}
                    </p>
                  </div>
                )}

                {/* Admin note */}
                <div className="space-y-1.5">
                  <Label htmlFor="admin-note" className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                    Admin note <span className="font-normal text-stone-300">(internal)</span>
                  </Label>
                  <Textarea
                    id="admin-note"
                    value={detailNote}
                    onChange={(e) => setDetailNote(e.target.value)}
                    rows={3}
                    placeholder="e.g. Left voicemail, trying again Tuesday."
                    className="resize-y"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void toggleStarred(detailLead.id, !detailLead.starred)}
                  className={detailLead.starred ? 'text-amber-600 hover:bg-amber-50' : 'text-stone-600 hover:bg-stone-100'}
                  title={detailLead.starred ? 'Remove star' : 'Star this lead'}
                >
                  <Star className={cn('size-4', detailLead.starred && 'fill-amber-400')} />
                  {detailLead.starred ? 'Starred' : 'Star'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-stone-600 hover:bg-stone-100"
                  title="Print this lead"
                >
                  <Printer className="size-4" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDeleteId(detailLead.id)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void toggleContacted(detailLead.id, !detailLead.contacted)}
                  className={detailLead.contacted ? 'text-stone-600' : 'text-emerald-700 hover:bg-emerald-50'}
                >
                  <CheckCircle2 className="size-4" />
                  {detailLead.contacted ? 'Mark uncontacted' : 'Mark contacted'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => void saveAdminNote()}
                  disabled={detailSaving}
                  className="bg-stone-900 text-white hover:bg-stone-800"
                >
                  {detailSaving ? 'Saving…' : 'Save note'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== Delete confirmation dialog ===== */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(o) => { if (!o) setConfirmDeleteId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="size-5 text-red-500" />
              Delete this lead?
            </DialogTitle>
            <DialogDescription>
              This permanently removes the lead from the database. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => { if (confirmDeleteId) void deleteLead(confirmDeleteId); }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 className="size-4" />
              Delete lead
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
