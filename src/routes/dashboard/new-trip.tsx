import { createFileRoute } from "@tanstack/react-router"
import { TripChat } from "@/components/trip-chat"

export const Route = createFileRoute("/dashboard/new-trip")({
  component: NewTripPage,
})

function NewTripPage() {
  return <TripChat />
}
