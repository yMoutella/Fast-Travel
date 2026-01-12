"use client"

import * as React from "react"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface Trip {
  id: string
  title: string
  description: string
  startDate: Date | null
  endDate: Date | null
  messages: Message[]
  createdAt: Date
  status: "planning" | "confirmed" | "completed"
}

interface TripsContextType {
  trips: Trip[]
  currentTrip: Trip | null
  createTrip: () => Trip
  updateTrip: (id: string, updates: Partial<Trip>) => void
  deleteTrip: (id: string) => void
  setCurrentTrip: (trip: Trip | null) => void
  addMessage: (tripId: string, message: Omit<Message, "id" | "timestamp">) => void
}

const TripsContext = React.createContext<TripsContextType | undefined>(undefined)

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = React.useState<Trip[]>([
    {
      id: "demo-1",
      title: "Weekend in Paris",
      description: "A romantic getaway to the city of lights",
      startDate: new Date(2026, 1, 14),
      endDate: new Date(2026, 1, 16),
      messages: [
        {
          id: "m1",
          role: "user",
          content: "I want to plan a romantic weekend in Paris for Valentine's Day",
          timestamp: new Date(2026, 0, 10),
        },
        {
          id: "m2",
          role: "assistant",
          content: "Paris is perfect for Valentine's Day! I'd recommend staying in the Marais district. Would you like suggestions for romantic restaurants and activities?",
          timestamp: new Date(2026, 0, 10),
        },
      ],
      createdAt: new Date(2026, 0, 10),
      status: "confirmed",
    },
    {
      id: "demo-2",
      title: "Tokyo Adventure",
      description: "Exploring Japanese culture and cuisine",
      startDate: new Date(2026, 3, 1),
      endDate: new Date(2026, 3, 10),
      messages: [],
      createdAt: new Date(2026, 0, 5),
      status: "planning",
    },
  ])
  const [currentTrip, setCurrentTrip] = React.useState<Trip | null>(null)

  const createTrip = (): Trip => {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title: "New Trip",
      description: "",
      startDate: null,
      endDate: null,
      messages: [],
      createdAt: new Date(),
      status: "planning",
    }
    setTrips((prev) => [...prev, newTrip])
    setCurrentTrip(newTrip)
    return newTrip
  }

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips((prev) =>
      prev.map((trip) => (trip.id === id ? { ...trip, ...updates } : trip))
    )
    if (currentTrip?.id === id) {
      setCurrentTrip((prev) => (prev ? { ...prev, ...updates } : null))
    }
  }

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id))
    if (currentTrip?.id === id) {
      setCurrentTrip(null)
    }
  }

  const addMessage = (tripId: string, message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
    }
    updateTrip(tripId, {
      messages: [...(trips.find((t) => t.id === tripId)?.messages || []), newMessage],
    })
  }

  return (
    <TripsContext.Provider
      value={{
        trips,
        currentTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        setCurrentTrip,
        addMessage,
      }}
    >
      {children}
    </TripsContext.Provider>
  )
}

export function useTrips() {
  const context = React.useContext(TripsContext)
  if (context === undefined) {
    throw new Error("useTrips must be used within a TripsProvider")
  }
  return context
}
