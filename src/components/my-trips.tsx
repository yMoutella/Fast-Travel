"use client"

import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import { format } from "date-fns"
import {
  Map,
  Calendar,
  MoreVertical,
  Trash2,
  MessageSquare,
  CheckCircle2,
  Clock,
  Plane,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTrips, type Trip } from "@/lib/trips-context"
import { cn } from "@/lib/utils"

const statusConfig = {
  planning: {
    label: "Planning",
    icon: Clock,
    variant: "outline" as const,
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    variant: "default" as const,
  },
  completed: {
    label: "Completed",
    icon: Plane,
    variant: "secondary" as const,
  },
}

function TripCard({ trip }: { trip: Trip }) {
  const navigate = useNavigate()
  const { setCurrentTrip, deleteTrip } = useTrips()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const status = statusConfig[trip.status]
  const StatusIcon = status.icon

  const handleOpenTrip = () => {
    setCurrentTrip(trip)
    navigate({ to: "/dashboard/new-trip" })
  }

  const handleDelete = () => {
    deleteTrip(trip.id)
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow cursor-pointer" onClick={handleOpenTrip}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <CardTitle className="text-base truncate">{trip.title}</CardTitle>
              {trip.description && (
                <CardDescription className="line-clamp-2">
                  {trip.description}
                </CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenTrip(); }}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Continue Planning
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => { e.stopPropagation(); setDeleteDialogOpen(true); }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Trip
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {trip.startDate ? (
                <span>
                  {format(trip.startDate, "MMM d")}
                  {trip.endDate && ` - ${format(trip.endDate, "MMM d, yyyy")}`}
                </span>
              ) : (
                <span>No dates set</span>
              )}
            </div>
            <Badge variant={status.variant} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
          </div>
          {trip.messages.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground">
                {trip.messages.length} message{trip.messages.length !== 1 ? "s" : ""} • Last updated{" "}
                {format(trip.messages[trip.messages.length - 1].timestamp, "MMM d")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{trip.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function MyTrips() {
  const { trips, createTrip } = useTrips()
  const navigate = useNavigate()

  const handleNewTrip = () => {
    createTrip()
    navigate({ to: "/dashboard/new-trip" })
  }

  const planningTrips = trips.filter((t) => t.status === "planning")
  const confirmedTrips = trips.filter((t) => t.status === "confirmed")
  const completedTrips = trips.filter((t) => t.status === "completed")

  if (trips.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Map className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Trips Yet</h2>
            <p className="text-muted-foreground mb-4">
              Start planning your first adventure! Our AI assistant will help you create the perfect trip.
            </p>
            <Button onClick={handleNewTrip}>
              Start Planning
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground">Manage and view all your travel plans</p>
        </div>

        {planningTrips.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Planning ({planningTrips.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {planningTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>
        )}

        {confirmedTrips.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Confirmed ({confirmedTrips.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {confirmedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>
        )}

        {completedTrips.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Plane className="h-5 w-5 text-muted-foreground" />
              Completed ({completedTrips.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>
        )}
      </div>
    </ScrollArea>
  )
}
