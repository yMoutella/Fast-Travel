"use client"

import * as React from "react"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import {
  PlaneTakeoff,
  Map,
  User,
  Settings,
  LogOut,
  Menu,
  Plus,
  ChevronLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"
import { useTrips } from "@/lib/trips-context"
import { cn } from "@/lib/utils"

interface SidebarProps {
  children: React.ReactNode
}

const navItems = [
  {
    title: "New Trip",
    href: "/dashboard/new-trip",
    icon: Plus,
  },
  {
    title: "My Trips",
    href: "/dashboard/trips",
    icon: Map,
  },
  {
    title: "Account",
    href: "/dashboard/account",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

function NavContent({ onItemClick }: { onItemClick?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { createTrip } = useTrips()

  const handleNewTrip = () => {
    createTrip()
    navigate({ to: "/dashboard/new-trip" })
    onItemClick?.()
  }

  const handleLogout = () => {
    logout()
    navigate({ to: "/" })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <PlaneTakeoff className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-lg">Fast Travel</h2>
          <p className="text-xs text-muted-foreground">AI Trip Planner</p>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon

            if (item.href === "/dashboard/new-trip") {
              return (
                <TooltipProvider key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className="w-full justify-start gap-3"
                        onClick={handleNewTrip}
                      >
                        <Icon className="h-4 w-4" />
                        {item.title}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Start planning a new trip
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            }

            return (
              <TooltipProvider key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3"
                      asChild
                      onClick={onItemClick}
                    >
                      <Link to={item.href}>
                        <Icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </ScrollArea>

      {/* User section */}
      <div className="mt-auto p-3 border-t">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sign out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-40">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72" showCloseButton={false}>
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <NavContent onItemClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarCollapsed ? (
          <div className="flex flex-col h-full py-4">
            <Button
              variant="ghost"
              size="icon"
              className="mx-auto mb-4"
              onClick={() => setSidebarCollapsed(false)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex flex-col items-center gap-2 px-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <TooltipProvider key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={item.href}>
                            <Icon className="h-5 w-5" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </div>
        ) : (
          <>
            <NavContent />
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-4 right-2"
              onClick={() => setSidebarCollapsed(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {children}
      </main>
    </div>
  )
}
