"use client"

import * as React from "react"
import { format } from "date-fns"
import { Send, Bot, User as UserIcon, CalendarDays, Sparkles } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useTrips, type Message } from "@/lib/trips-context"
import { cn } from "@/lib/utils"

// Simulated AI responses based on user input
const getAIResponse = (userMessage: string, dates?: { start?: Date; end?: Date }): string => {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes("beach") || lowerMessage.includes("tropical")) {
    return `🏖️ A beach getaway sounds wonderful! Based on your dates${dates?.start ? ` (${format(dates.start, "MMM d")} - ${dates?.end ? format(dates.end, "MMM d") : "..."})` : ""}, I'd recommend:

**Top Beach Destinations:**
• Maldives - Perfect for luxury overwater villas
• Bali, Indonesia - Great mix of beaches and culture
• Cancún, Mexico - Beautiful Caribbean waters

Would you like me to elaborate on any of these destinations?`
  }

  if (lowerMessage.includes("city") || lowerMessage.includes("urban")) {
    return `🏙️ City adventures are always exciting! Here are some recommendations:

**Must-Visit Cities:**
• Tokyo, Japan - Blend of tradition and innovation
• Barcelona, Spain - Art, architecture, and beaches
• New York City - The city that never sleeps

What kind of city experience interests you most - cultural, culinary, or nightlife?`
  }

  if (lowerMessage.includes("adventure") || lowerMessage.includes("hiking")) {
    return `🏔️ Adventure awaits! For thrill-seekers, I suggest:

**Adventure Destinations:**
• Queenstown, New Zealand - Adventure capital
• Costa Rica - Rainforests and zip-lining
• Swiss Alps - Hiking and stunning views

How intense of an adventure are you looking for?`
  }

  return `Great! I'd love to help you plan your trip${dates?.start ? ` from ${format(dates.start, "MMMM d, yyyy")}` : ""}${dates?.end ? ` to ${format(dates.end, "MMMM d, yyyy")}` : ""}.

To give you the best recommendations, could you tell me:
• What type of experience are you looking for? (relaxation, adventure, culture)
• Your budget range
• Any specific activities you want to include

Feel free to describe your dream trip in detail! 🌍✨`
}

export function TripChat() {
  const { currentTrip, updateTrip, addMessage } = useTrips()
  const [inputValue, setInputValue] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    currentTrip?.startDate && currentTrip?.endDate
      ? { from: currentTrip.startDate, to: currentTrip.endDate }
      : undefined
  )
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const messages = currentTrip?.messages || []

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Update trip dates when calendar selection changes
  React.useEffect(() => {
    if (currentTrip && dateRange) {
      updateTrip(currentTrip.id, {
        startDate: dateRange.from || null,
        endDate: dateRange.to || null,
      })
    }
  }, [dateRange, currentTrip, updateTrip])

  const handleSend = async () => {
    if (!inputValue.trim() || !currentTrip) return

    const userMessage = inputValue.trim()
    setInputValue("")

    // Add user message
    addMessage(currentTrip.id, {
      role: "user",
      content: userMessage,
    })

    // Simulate AI thinking
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Add AI response
    const aiResponse = getAIResponse(userMessage, {
      start: dateRange?.from,
      end: dateRange?.to,
    })

    addMessage(currentTrip.id, {
      role: "assistant",
      content: aiResponse,
    })

    // Update trip title based on first message
    if (messages.length === 0) {
      const title = userMessage.length > 30 
        ? userMessage.substring(0, 30) + "..." 
        : userMessage
      updateTrip(currentTrip.id, { title, description: userMessage })
    }

    setIsTyping(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!currentTrip) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Start Planning Your Trip</h2>
            <p className="text-muted-foreground">
              Click "New Trip" in the sidebar to begin planning your next adventure with AI assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-2rem)] lg:h-screen">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b bg-card/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">AI Travel Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Describe your dream trip and I'll help you plan it
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 lg:p-6" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Start a Conversation</h3>
              <p className="text-muted-foreground max-w-sm">
                Tell me about your ideal trip - where you want to go, what you want to experience, and any preferences you have.
              </p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {["Beach vacation", "City adventure", "Mountain hiking"].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(`I want to plan a ${suggestion.toLowerCase()}`)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 max-w-[80%] whitespace-pre-wrap",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-secondary">
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl px-4 py-2">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 lg:p-6 border-t bg-card/50">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Describe your trip... (e.g., 'I want a relaxing beach vacation for 2 weeks')"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              size="icon-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <Separator orientation="vertical" className="hidden lg:block" />
      <div className="border-t lg:border-t-0 lg:w-80 flex-shrink-0 bg-card/30">
        <Card className="border-0 shadow-none bg-transparent h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4" />
              Trip Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              disabled={{ before: new Date() }}
              className="rounded-md border"
            />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Start Date</p>
                <p className="font-medium">
                  {dateRange?.from ? format(dateRange.from, "MMM d, yyyy") : "Not selected"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">End Date</p>
                <p className="font-medium">
                  {dateRange?.to ? format(dateRange.to, "MMM d, yyyy") : "Not selected"}
                </p>
              </div>
            </div>
            {dateRange?.from && dateRange?.to && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-center">
                  <span className="font-medium">
                    {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))}
                  </span>{" "}
                  days trip
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
