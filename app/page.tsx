import Link from "next/link";
import { NexLogo } from "@/components/ui/nex-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Compass,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Code2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation */}
      <header className="border-b border-border/80 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <NexLogo />

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="/community"
              className="hover:text-foreground transition-colors"
            >
              Community
            </Link>
            <Link
              href="/projects"
              className="hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/opportunities"
              className="hover:text-foreground transition-colors"
            >
              Opportunities
            </Link>
            <Link
              href="/events"
              className="hover:text-foreground transition-colors"
            >
              Events
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center my-auto">
        <Badge
          variant="default"
          className="mb-6 px-3.5 py-1 text-xs uppercase tracking-wider font-semibold"
        >
          <Sparkles className="size-3 mr-1.5 inline" />
          The Student Tech Builder Hub
        </Badge>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-foreground">
          Ready to take your <span className="text-primary italic">NEX</span>{" "}
          step in tech?
        </h1>

        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A student-driven tech community built for learners, creators,
          innovators, and future tech professionals.
        </p>

        {/* Pillars / Subhead banner */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold tracking-wide text-foreground/80">
          <span className="px-3 py-1 rounded-md bg-secondary border border-border">
            Learn
          </span>
          <span className="text-primary">•</span>
          <span className="px-3 py-1 rounded-md bg-secondary border border-border">
            Build
          </span>
          <span className="text-primary">•</span>
          <span className="px-3 py-1 rounded-md bg-secondary border border-border">
            Collaborate
          </span>
          <span className="text-primary">•</span>
          <span className="px-3 py-1 rounded-md bg-secondary border border-border">
            Compete
          </span>
          <span className="text-primary">•</span>
          <span className="px-3 py-1 rounded-md bg-secondary border border-border">
            Connect
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-8 font-semibold">
              Make Your Nex Move
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </Link>
          <Link href="/community" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Community Feed
            </Button>
          </Link>
        </div>

        {/* Foundation Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20 text-left w-full">
          <Card className="bg-card/70 border-border/80 hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                <Users className="size-5" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1.5">
                Community Discussions
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect with fellow students, ask technical questions, and
                participate in peer discussions with optional anonymous posting.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/70 border-border/80 hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                <Code2 className="size-5" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1.5">
                Project & Collab Engine
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Showcase your prototypes, recruit team members for upcoming
                hackathons, and find beta testers for your MVPs.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/70 border-border/80 hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                <Compass className="size-5" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1.5">
                Opportunities & Events
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Never miss an internship, hackathon registration, or local
                workshop with timely deadline tracking and calendar RSVP.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 py-8 bg-card/40">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <NexLogo showWordmark={false} className="scale-75" />
            <span>
              © 2026 Nex Network. Built for student builders.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
