import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { DashboardLayout } from "@/components/dashboard-layout"

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayoutWrapper,
})

function DashboardLayoutWrapper() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
