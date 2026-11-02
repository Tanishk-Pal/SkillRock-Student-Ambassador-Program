import { Navigate, Outlet } from 'react-router-dom'

export function AdminRoute() {
  const token = localStorage.getItem('ssap_admin_token')
  if (!token) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
