import { redirect } from 'next/navigation';
import { verifyAdminAuthFromCookies } from '@/lib/admin-auth';
import AdminLeadsDashboard from './dashboard';

// Server-component page that checks admin auth before rendering the
// dashboard. If not authed, redirect to /admin/login.
export default async function AdminLeadsPage() {
  const authed = await verifyAdminAuthFromCookies();
  if (!authed) {
    redirect('/admin/login');
  }
  return <AdminLeadsDashboard />;
}
