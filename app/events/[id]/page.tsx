"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initialEvents, currentUserProfile } from "@/lib/mock-data";
import { TechEvent, EventType } from "@/lib/types";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle2,
  Share2,
  ExternalLink,
  Sparkles,
  CalendarPlus,
  Video,
  Building,
  GraduationCap,
} from "lucide-react";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const event =
    initialEvents.find((e) => e.id === eventId) || initialEvents[0];

  const [isRegistered, setIsRegistered] = React.useState(event.id === "evt-1");
  const [registeredCount, setRegisteredCount] = React.useState(event.registeredCount);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleRegister = () => {
    setIsRegistered(true);
    setRegisteredCount((c) => Math.min(event.capacity, c + 1));
    setShowConfirmModal(false);
  };

  const handleCancelRegistration = () => {
    setIsRegistered(false);
    setRegisteredCount((c) => Math.max(0, c - 1));
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const spotsLeft = event.capacity - registeredCount;
  const capacityPercent = Math.round((registeredCount / event.capacity) * 100);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getBadgeVariant = (type: EventType) => {
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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Tech Events Directory
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyShare}
            className="text-xs gap-1.5 font-medium"
          >
            <Share2 className="size-3.5" />
            {copiedLink ? "Link Copied!" : "Share Event"}
          </Button>
        </div>

        {/* Hero Banner Header */}
        <Card className="bg-card border-border/80 overflow-hidden shadow-md">
          <div className={`h-24 sm:h-32 bg-gradient-to-r ${event.bannerGradient} relative border-b border-border/60 flex items-end p-6`}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getBadgeVariant(event.type)} className="text-xs uppercase font-mono px-3 py-1">
                {event.type.replace("_", " ")}
              </Badge>
              <Badge variant="outline" className="text-xs bg-background/80 font-mono">
                {event.locationType}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                {event.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                Organized by <span className="text-foreground font-semibold">{event.organizer}</span>
              </p>
            </div>

            {/* Quick logistics bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/60 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary/50 border border-border/40">
                <Calendar className="size-4 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono">Date</p>
                  <p className="font-semibold text-foreground">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary/50 border border-border/40">
                <Clock className="size-4 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono">Schedule</p>
                  <p className="font-semibold text-foreground font-mono">
                    {event.startTime} - {event.endTime} (PHT)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary/50 border border-border/40">
                {event.locationType === "ONLINE" ? (
                  <Video className="size-4 text-primary shrink-0" />
                ) : (
                  <Building className="size-4 text-primary shrink-0" />
                )}
                <div className="truncate">
                  <p className="text-[10px] text-muted-foreground uppercase font-mono">Venue / Access</p>
                  <p className="font-semibold text-foreground truncate">{event.location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Layout: Main Info & Right RSVP Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview / Description */}
            <Card className="bg-card/70 border-border/80 p-6 space-y-3">
              <h2 className="text-base font-bold text-foreground">About This Session</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-3">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono bg-secondary text-secondary-foreground px-2.5 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>

            {/* Featured Speaker Spotlight */}
            <Card className="bg-card/70 border-border/80 p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground">Featured Speaker</h2>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/60">
                <div className="size-14 rounded-2xl bg-primary/20 text-primary font-bold text-xl flex items-center justify-center shrink-0 border border-primary/30">
                  {event.speaker.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-foreground text-base">
                    {event.speaker.name}
                  </h3>
                  <p className="text-xs text-primary font-medium">
                    {event.speaker.role}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {event.speaker.organization}
                  </p>
                </div>
              </div>
            </Card>

            {/* Full Agenda Timeline */}
            <Card className="bg-card/70 border-border/80 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">Event Schedule & Agenda</h2>
                <span className="text-xs font-mono text-muted-foreground">Philippine Standard Time</span>
              </div>

              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/80">
                {event.agenda.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 relative pl-8">
                    <div className="absolute left-2.5 top-1.5 size-2 rounded-full bg-primary ring-4 ring-background" />
                    <div className="p-3.5 rounded-lg bg-background/40 border border-border/60 w-full space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-primary font-mono">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Interactive Registration & Capacity Widget */}
          <div className="space-y-4">
            <Card className="bg-card/90 border-border/80 p-6 space-y-5 sticky top-20 shadow-md">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Registration & RSVP</h3>
                <p className="text-xs text-muted-foreground">
                  Free student entry • Open to university developers
                </p>
              </div>

              {/* Live Capacity Bar */}
              <div className="space-y-2 p-3.5 rounded-xl bg-background/50 border border-border/60">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Users className="size-3.5 text-primary" />
                    {registeredCount} / {event.capacity}
                  </span>
                  <span className={spotsLeft <= 15 ? "text-amber-400 font-bold" : "text-muted-foreground"}>
                    {spotsLeft} spots remaining
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      capacityPercent > 85 ? "bg-amber-400" : "bg-primary"
                    }`}
                    style={{ width: `${Math.min(100, capacityPercent)}%` }}
                  />
                </div>
              </div>

              {/* Registration Status or CTA */}
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span>RSVP Confirmed: Seat Reserved</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      You are confirmed for this session. A calendar reminder and access link have been synced to your student profile.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelRegistration}
                    className="w-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                  >
                    Cancel Registration
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    size="default"
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full font-bold text-sm h-10 shadow-sm"
                  >
                    Reserve My Seat
                  </Button>
                  <p className="text-[11px] text-center text-muted-foreground">
                    Instant confirmation. No credit card or registration fee required.
                  </p>
                </div>
              )}

              {/* Add to Calendar Link */}
              <div className="pt-2 border-t border-border/60">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => alert("Calendar invite exported! Event added to calendar.")}
                  className="w-full justify-center text-xs text-muted-foreground hover:text-foreground gap-2 font-mono"
                >
                  <CalendarPlus className="size-4 text-primary" />
                  Add to Google Calendar
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Modal: Confirm Student RSVP */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card border-border/80 shadow-2xl space-y-4 p-6">
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Calendar className="size-5 text-primary" />
                  Confirm Event Registration
                </h3>
                <p className="text-xs text-muted-foreground">
                  Confirming your attendance for {event.title}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-background/60 border border-border/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student Name:</span>
                  <span className="font-semibold text-foreground">
                    {currentUserProfile.firstName} {currentUserProfile.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">University:</span>
                  <span className="font-semibold text-foreground">
                    {currentUserProfile.schoolName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student Handle:</span>
                  <span className="font-mono text-primary">
                    @{currentUserProfile.username}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleRegister}
                  className="text-xs font-semibold gap-1.5"
                >
                  <CheckCircle2 className="size-4" />
                  Confirm RSVP
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
