'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calculator, DollarSign, Info, Phone, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BUSINESS } from '@/lib/business-info';
import { useEstimateStore } from '@/lib/estimate-store';

type ServiceKey = 'plumbing' | 'carpentry' | 'power-washing';
type ScopeKey = 'small' | 'medium' | 'large';
type UrgencyKey = 'standard' | 'same-day';

const SCOPES: { key: ScopeKey; label: string; blurb: string; multiplier: number }[] = [
  { key: 'small', label: 'Small', blurb: 'Single fixture or quick repair · 1 hour or less', multiplier: 1 },
  { key: 'medium', label: 'Medium', blurb: 'Multi-part job or half-day project', multiplier: 2.4 },
  { key: 'large', label: 'Large', blurb: 'Full-day or multi-day remodel / build', multiplier: 5.2 },
];

const URGENCIES: { key: UrgencyKey; label: string; blurb: string; surcharge: number }[] = [
  { key: 'standard', label: 'Standard', blurb: 'Next available appointment · 24–72 hr', surcharge: 0 },
  { key: 'same-day', label: 'Same-day / Emergency', blurb: 'Priority dispatch · today', surcharge: 90 },
];

const BASE_BY_SERVICE: Record<ServiceKey, { base: number; label: string; unit: string; examples: string[] }> = {
  plumbing: {
    base: 120,
    label: 'Plumbing',
    unit: 'job',
    examples: ['Faucet swap', 'Disposal install', 'Toilet reset', 'Drain repair'],
  },
  'power-washing': {
    base: 180,
    label: 'Power Washing',
    unit: 'surface',
    examples: ['Driveway', 'Patio', 'Deck', 'Siding refresh'],
  },
  carpentry: {
    base: 295,
    label: 'Carpentry',
    unit: 'project',
    examples: ['Deck build', 'Porch', 'Drywall patch', 'Cabinet install'],
  },
};

export function ServiceEstimator() {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState<ServiceKey>('plumbing');
  const [scope, setScope] = useState<ScopeKey>('small');
  const [urgency, setUrgency] = useState<UrgencyKey>('standard');
  const [zip, setZip] = useState('');
  const setEstimate = useEstimateStore((s) => s.setEstimate);

  const { low, high, breakdown } = useMemo(() => {
    const cfg = BASE_BY_SERVICE[service];
    const scopeCfg = SCOPES.find((s) => s.key === scope)!;
    const urgCfg = URGENCIES.find((u) => u.key === urgency)!;
    const base = cfg.base * scopeCfg.multiplier;
    const subtotal = base + urgCfg.surcharge;
    // ±15% to express a range (job-specific variables).
    const low = Math.round((subtotal * 0.85) / 5) * 5;
    const high = Math.round((subtotal * 1.15) / 5) * 5;
    return {
      low,
      high,
      breakdown: {
        base: Math.round(base),
        urgency: urgCfg.surcharge,
        subtotal: Math.round(subtotal),
      },
    };
  }, [service, scope, urgency]);

  // Persist the latest estimate to the shared store so the lead form can
  // attach it to the submitted lead. Only updates when the dialog is open
  // (so we don't pollute leads with stale estimates the user never saw).
  useEffect(() => {
    if (!open) return;
    const cfg = BASE_BY_SERVICE[service];
    const scopeCfg = SCOPES.find((s) => s.key === scope)!;
    const urgCfg = URGENCIES.find((u) => u.key === urgency)!;
    setEstimate({
      range: `$${low.toLocaleString()} – $${high.toLocaleString()}`,
      breakdown: `${cfg.label} · ${scopeCfg.label} · ${urgCfg.label}`,
      at: Date.now(),
    });
  }, [open, low, high, service, scope, urgency, setEstimate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:border-amber-500 hover:bg-amber-100 sm:text-sm"
          title="Get an instant price range for your job"
        >
          <Calculator className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Estimate Cost</span>
          <span className="sm:hidden">Estimate</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber-500 text-stone-950">
              <Calculator className="h-5 w-5" aria-hidden />
            </span>
            Instant Price Estimate
          </DialogTitle>
          <DialogDescription>
            Pick a trade, scope, and urgency to get a ballpark range. Final
            flat-price quote is confirmed by phone — usually within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Service */}
          <div className="space-y-2">
            <Label htmlFor="est-service" className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Trade
            </Label>
            <Select
              value={service}
              onValueChange={(v) => setService(v as ServiceKey)}
            >
              <SelectTrigger id="est-service" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plumbing">Plumbing — from $120</SelectItem>
                <SelectItem value="carpentry">Carpentry — from $295</SelectItem>
                <SelectItem value="power-washing">Power Washing — from $180</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-stone-500">
              Examples: {BASE_BY_SERVICE[service].examples.join(' · ')}
            </p>
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Scope
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {SCOPES.map((s) => {
                const isActive = s.key === scope;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setScope(s.key)}
                    aria-pressed={isActive}
                    className={`rounded-md border px-3 py-2 text-left transition-colors ${
                      isActive
                        ? 'border-amber-500 bg-amber-50 text-stone-900'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="text-[11px] leading-tight text-stone-500">
                      {s.blurb}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Urgency
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {URGENCIES.map((u) => {
                const isActive = u.key === urgency;
                return (
                  <button
                    key={u.key}
                    type="button"
                    onClick={() => setUrgency(u.key)}
                    aria-pressed={isActive}
                    className={`rounded-md border px-3 py-2 text-left transition-colors ${
                      isActive
                        ? 'border-amber-500 bg-amber-50 text-stone-900'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="text-sm font-semibold">{u.label}</div>
                    <div className="text-[11px] leading-tight text-stone-500">
                      {u.blurb}
                    </div>
                    {u.surcharge > 0 && (
                      <div className="text-[11px] mt-0.5 font-medium text-amber-700">
                        +${u.surcharge} dispatch
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zip (optional, no validation — just visual) */}
          <div className="space-y-2">
            <Label htmlFor="est-zip" className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              ZIP code <span className="font-normal text-stone-400">(optional)</span>
            </Label>
            <Input
              id="est-zip"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
              placeholder="01101"
              inputMode="numeric"
              className="w-32"
            />
            <p className="text-xs text-stone-500">
              We confirm service area when Rick calls you back.
            </p>
          </div>

          {/* Result */}
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                  Estimated range
                </p>
                <p className="mt-1 text-3xl font-bold text-stone-950 tabular-nums">
                  ${low.toLocaleString()} – ${high.toLocaleString()}
                </p>
              </div>
              <Sparkles className="h-6 w-6 text-amber-500" aria-hidden />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-700">
              <div className="flex justify-between">
                <dt className="text-stone-500">Base</dt>
                <dd className="tabular-nums">${breakdown.base.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Dispatch fee</dt>
                <dd className="tabular-nums">
                  {breakdown.urgency > 0 ? `$${breakdown.urgency}` : '—'}
                </dd>
              </div>
            </dl>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-stone-600">
              <Info className="mt-px h-3 w-3 shrink-0" aria-hidden />
              <span>
                Range is ±15% of an industry-typical scope. Rick gives you a
                flat, upfront price before any work starts — no surprise
                add-ons.
              </span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
            >
              <DollarSign className="h-4 w-4" aria-hidden />
              Get my exact flat-price quote
            </a>
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:border-stone-900 hover:bg-stone-100"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call {BUSINESS.phone}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
