"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles, ArrowRight } from "lucide-react";

export default function EventsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="size-7 text-primary" />
              Tech Events & Hackathon Calendar
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Workshops, campus tech conferences, and student hackathon schedules
            </p>
          </div>

          <Badge variant="warning" className="text-xs uppercase font-mono self-start sm:self-auto">
            Phase 3 Scope
          </Badge>
        </div>

        <Card className="border-border/80 bg-card p-10 text-center space-y-4">
          <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
            <Sparkles className="size-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Event Registration & Calendar RSVP Arriving in Phase 3
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Phase 3 introduces direct event registration, capacity tracking, calendar reminders, and workshop announcements.
          </p>
          <div className="pt-2">
            <Link href="/community">
              <Button size="sm" className="font-semibold gap-1.5">
                Join Community Discussions
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
