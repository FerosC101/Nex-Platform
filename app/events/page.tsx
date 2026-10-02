"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { initialEvents } from "@/lib/mock-data";
import { TechEvent, EventType, LocationType } from "@/lib/types";
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const EVENT_TYPES: { label: string; value: EventType | "ALL" }[] = [
  { label: "All Events", value: "ALL" },
  { label: "Workshops", value: "WORKSHOP" },
  { label: "Hackathons", value: "HACKATHON_KICKOFF" },
  { label: "Campus Meetups", value: "CAMPUS_MEETUP" },
];

export default function EventsPage() {
  const [events, setEvents] = React.useState<TechEvent[]>(initialEvents);
  const [selectedType, setSelectedType] = React.useState<EventType | "ALL">("ALL");
  const [selectedLocation, setSelectedLocation] = React.useState<LocationType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [registeredEventIds, setRegisteredEventIds] = React.useState<Set<string>>(
    new Set(["evt-1"])
  );

  const toggleRSVP = (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setRegisteredEventIds((prev) => {
      const next = new Set(prev);
      const isAlreadyRegistered = next.has(eventId);

      if (isAlreadyRegistered) {
        next.delete(eventId);
        setEvents((prevEvents) =>
          prevEvents.map((evt) =>
            evt.id === eventId
              ? { ...evt, registeredCount: Math.max(0, evt.registeredCount - 1) }
              : evt
          )
        );
      } else {
        next.add(eventId);
        setEvents((prevEvents) =>
          prevEvents.map((evt) =>
            evt.id === eventId
              ? { ...evt, registeredCount: Math.min(evt.capacity, evt.registeredCount + 1) }
              : evt
          )
        );
      }
      return next;
    });
  };

  const filteredEvents = events.filter((event) => {
    const matchesType =
      selectedType === "ALL" || event.type === selectedType;
    const matchesLocation =
      selectedLocation === "ALL" || event.locationType === selectedLocation;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesLocation && matchesSearch;
  });

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  const getEventTypeBadgeVariant = (type: EventType) => {
    switch (type) {
      case "WORKSHOP":
        return "default";
      case "HACKATHON_KICKOFF":
        return "warning";
      case "CAMPUS_MEETUP":
        return "secondary";
      case "TECH_CONFERENCE":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="size-7 text-primary" />
              Tech Events & Hackathon Calendar
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Workshops, campus tech conferences, hands-on labs, and student developer meetups
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs font-mono text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 border border-border/80">
              <CheckCircle2 className="size-3.5 text-primary" />
              {registeredEventIds.size} RSVP Reserved
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <Card className="bg-card/70 border-border/80 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search events by topic, speaker, or tech stack (e.g. Next.js, IoT, DOST)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 border-border/80 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value as LocationType | "ALL")}
                className="h-9 px-3 rounded-lg border border-border/80 bg-background/50 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="ALL">All Formats</option>
                <option value="ONLINE">Virtual / Zoom</option>
                <option value="ONSITE">In-Person Campus</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {EVENT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                  selectedType === type.value
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Events Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono px-1">
            <span>
              Showing {filteredEvents.length} upcoming events
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <Card className="bg-card/70 border-dashed border-border/80 p-12 text-center space-y-3">
              <Calendar className="size-10 text-muted-foreground mx-auto opacity-50" />
              <h3 className="font-bold text-foreground text-base">No events match your search</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try selecting "All Events" or resetting filters to browse all upcoming sessions.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("ALL");
                  setSelectedLocation("ALL");
                }}
                className="mt-2 text-xs"
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredEvents.map((event) => {
                const { month, day } = formatEventDate(event.date);
                const isRegistered = registeredEventIds.has(event.id);
                const spotsLeft = event.capacity - event.registeredCount;
                const capacityPercent = Math.round((event.registeredCount / event.capacity) * 100);

                return (
                  <Card
                    key={event.id}
                    className="bg-card/70 border-border/80 hover:border-primary/40 transition-all flex flex-col justify-between group shadow-sm overflow-hidden"
                  >
                    {/* Top Decorative Header */}
                    <div className={`h-2 bg-gradient-to-r ${event.bannerGradient}`} />

                    <CardContent className="p-5 space-y-4">
                      {/* Date Badge + Category + Format */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Calendar Date Block */}
                          <div className="size-13 rounded-xl border border-border/80 bg-background/80 flex flex-col items-center justify-center shrink-0 p-1">
                            <span className="text-[10px] font-bold tracking-widest text-primary font-mono">
                              {month}
                            </span>
                            <span className="text-lg font-extrabold leading-none text-foreground">
                              {day}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <Badge
                              variant={getEventTypeBadgeVariant(event.type)}
                              className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5"
                            >
                              {event.type.replace("_", " ")}
                            </Badge>
                            <p className="text-[11px] text-muted-foreground font-medium">
                              Organized by {event.organizer}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary/80 text-muted-foreground border border-border/60">
                          {event.locationType}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <Link
                          href={`/events/${event.id}`}
                          className="font-bold text-base text-foreground group-hover:text-primary transition-colors block leading-snug"
                        >
                          {event.title}
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      {/* Speaker Spotlight */}
                      <div className="flex items-center gap-2.5 p-2 rounded-lg bg-background/50 border border-border/50 text-xs">
                        <div className="size-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                          {event.speaker.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-foreground truncate">
                            {event.speaker.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {event.speaker.role} • {event.speaker.organization}
                          </p>
                        </div>
                      </div>

                      {/* Time & Venue Info */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="size-3 text-primary" />
                          {event.startTime} - {event.endTime}
                        </span>
                        <span className="text-border/80">•</span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="size-3 text-muted-foreground" />
                          {event.location}
                        </span>
                      </div>

                      {/* Capacity Progress Bar */}
                      <div className="space-y-1.5 pt-1 border-t border-border/40">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Users className="size-3 text-primary" />
                            {event.registeredCount}/{event.capacity} Registered
                          </span>
                          <span
                            className={
                              spotsLeft <= 10
                                ? "text-amber-400 font-bold"
                                : "text-muted-foreground"
                            }
                          >
                            {spotsLeft} spots remaining
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              capacityPercent > 85 ? "bg-amber-400" : "bg-primary"
                            }`}
                            style={{ width: `${Math.min(100, capacityPercent)}%` }}
                          />
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <Link
                          href={`/events/${event.id}`}
                          className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                        >
                          View Agenda & Details
                          <ArrowRight className="size-3" />
                        </Link>

                        <Button
                          size="sm"
                          variant={isRegistered ? "secondary" : "default"}
                          onClick={(e) => toggleRSVP(event.id, e)}
                          className="font-semibold text-xs h-8 gap-1.5"
                        >
                          {isRegistered ? (
                            <>
                              <CheckCircle2 className="size-3.5 text-primary" />
                              Reserved (Cancel)
                            </>
                          ) : (
                            "RSVP / Register"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
