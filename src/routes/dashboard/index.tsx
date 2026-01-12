import { createFileRoute, redirect } from "@tanstack/react-router"
import { MyTrips } from "@/components/my-trips"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
})

function DashboardIndex() {
  return <MyTrips />
}
