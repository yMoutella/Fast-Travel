import { createFileRoute } from "@tanstack/react-router"
import { AppSettings } from "@/components/app-settings"

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  return <AppSettings />
}
