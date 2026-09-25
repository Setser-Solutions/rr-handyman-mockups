'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BUSINESS } from '@/lib/business-info';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading || !password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        router.push('/admin/leads');
        router.refresh();
      } else {
        setError(data?.error || 'Login failed. Try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-stone-900 text-lg font-bold text-amber-400 shadow-md">
              R&amp;R
            </div>
            <h1 className="text-2xl font-bold text-stone-900">{BUSINESS.brand}</h1>
            <p className="mt-1 text-sm text-stone-500">Admin dashboard sign-in</p>
          </div>

          {/* Login card */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Lock className="h-5 w-5 text-stone-400" aria-hidden />
              <h2 className="text-base font-semibold text-stone-900">Enter password</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    autoFocus
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone-400 hover:text-stone-700"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Sign in
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <span className="font-semibold">Mockup password:</span>{' '}
              <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">RR-admin-2026</code>
              <p className="mt-1 text-amber-700">
                Change <code className="font-mono">ADMIN_PASSWORD</code> env var before going live.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to website
            </a>
          </div>
        </div>
      </main>
      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} {BUSINESS.brand} · Admin ·{' '}
        <a
          href="https://setsersolutions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-400 transition-colors hover:text-yellow-600"
        >
          Setser Solutions
        </a>
      </footer>
    </div>
  );
}
