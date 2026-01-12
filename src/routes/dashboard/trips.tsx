import { createFileRoute } from "@tanstack/react-router"
import { MyTrips } from "@/components/my-trips"

export const Route = createFileRoute("/dashboard/trips")({
  component: TripsPage,
})

function TripsPage() {
  return <MyTrips />
}
