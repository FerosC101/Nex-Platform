"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, Sparkles, ArrowRight } from "lucide-react";

export default function OpportunitiesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Compass className="size-7 text-primary" />
              Opportunities & Grants
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Hackathons, student internships, fellowships, and startup grants
            </p>
          </div>

          <Badge variant="warning" className="text-xs uppercase font-mono self-start sm:self-auto">
            Phase 3 Scope
          </Badge>
        </div>

        <Card className="border-border/80 bg-card p-10 text-center space-y-4">
          <div className="size-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <Sparkles className="size-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Curated Student Opportunities Arriving in Phase 3
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Phase 3 introduces bookmarking, external application links, eligibility filters, and deadline countdown notifications for nationwide hackathons and student tech fellowships.
          </p>
          <div className="pt-2">
            <Link href="/community">
              <Button size="sm" className="font-semibold gap-1.5">
                Check Community Opportunities
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
