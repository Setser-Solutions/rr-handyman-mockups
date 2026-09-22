'use client';

import { create } from 'zustand';

/**
 * Tiny shared store for the Service Estimator's last-computed price range.
 *
 * Why a store instead of props/context? The estimator lives in the switcher
 * banner (page.tsx) but the lead form lives deep inside each design
 * component. Rather than threading props through every design, we use a
 * small Zustand store that:
 *   - The estimator writes to whenever the user changes Trade/Scope/Urgency
 *   - The useLeadForm hook reads from when submitting a lead
 *
 * This means every lead submitted after using the estimator will have the
 * price range snapshot attached (e.g. "$1,305 – $1,765 (Carpentry · Large · Standard)"),
 * which is useful for sales follow-up.
 */

export interface EstimateSnapshot {
  /** Human-readable range, e.g. "$1,305 – $1,765" */
  range: string;
  /** Breakdown label, e.g. "Carpentry · Large · Standard" */
  breakdown: string;
  /** ISO timestamp of when this estimate was last computed */
  at: number;
}

interface EstimateStore {
  estimate: EstimateSnapshot | null;
  setEstimate: (e: EstimateSnapshot | null) => void;
}

export const useEstimateStore = create<EstimateStore>((set) => ({
  estimate: null,
  setEstimate: (e) => set({ estimate: e }),
}));

/**
 * Format an estimate snapshot into a single string suitable for the Lead.estimate
 * column. Returns null if no estimate has been set yet.
 */
export function formatEstimate(e: EstimateSnapshot | null): string | undefined {
  if (!e) return undefined;
  return `${e.range} (${e.breakdown})`;
}
