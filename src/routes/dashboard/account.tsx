import { createFileRoute } from "@tanstack/react-router"
import { AccountSettings } from "@/components/account-settings"

export const Route = createFileRoute("/dashboard/account")({
  component: AccountPage,
})

function AccountPage() {
  return <AccountSettings />
}
