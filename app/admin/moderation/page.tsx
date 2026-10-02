"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initialModerationReports } from "@/lib/mock-data";
import { ModerationReport, ReportReason, ReportStatus } from "@/lib/types";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Eye,
  Trash2,
  Check,
  RotateCcw,
} from "lucide-react";

export default function AdminModerationPage() {
  const [reports, setReports] = React.useState<ModerationReport[]>(initialModerationReports);
  const [statusFilter, setStatusFilter] = React.useState<ReportStatus | "ALL">("ALL");
  const [reasonFilter, setReasonFilter] = React.useState<ReportReason | "ALL">("ALL");

  const pendingCount = reports.filter((r) => r.status === "PENDING").length;
  const actionTakenCount = reports.filter((r) => r.status === "ACTION_TAKEN").length;
  const dismissedCount = reports.filter((r) => r.status === "DISMISSED").length;

  const handleDismiss = (id: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "DISMISSED", reviewedBy: "Georgie Villar (Lead)" }
          : r
      )
    );
  };

  const handleTakeAction = (id: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "ACTION_TAKEN", reviewedBy: "Georgie Villar (Lead)" }
          : r
      )
    );
  };

  const filteredReports = reports.filter((r) => {
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesReason = reasonFilter === "ALL" || r.reason === reasonFilter;
    return matchesStatus && matchesReason;
  });

  const getReasonBadgeVariant = (reason: ReportReason) => {
    switch (reason) {
      case "SCAM":
      case "HARASSMENT":
        return "destructive";
      case "SPAM":
      case "INAPPROPRIATE_CONTENT":
        return "warning";
      case "MISLEADING_CONTENT":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            <AlertTriangle className="size-3" /> Pending Review
          </span>
        );
      case "ACTION_TAKEN":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <CheckCircle className="size-3" /> Action Taken
          </span>
        );
      case "DISMISSED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">
            <XCircle className="size-3" /> Dismissed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[11px] font-mono text-muted-foreground">
            {status}
          </span>
        );
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <ShieldAlert className="size-7 text-primary" />
              Admin Moderation & Safety Queue
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review flagged student reports and enforce community guidelines (Technical Spec Section 21)
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-mono self-start sm:self-auto">
            Moderator Access Only
          </Badge>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card/70 border-border/80 p-4 space-y-1">
            <p className="text-xs font-mono text-muted-foreground">Pending Reports</p>
            <p className="text-2xl font-extrabold text-amber-400">{pendingCount}</p>
          </Card>
          <Card className="bg-card/70 border-border/80 p-4 space-y-1">
            <p className="text-xs font-mono text-muted-foreground">Actions Enforced</p>
            <p className="text-2xl font-extrabold text-emerald-400">{actionTakenCount}</p>
          </Card>
          <Card className="bg-card/70 border-border/80 p-4 space-y-1">
            <p className="text-xs font-mono text-muted-foreground">Dismissed / Safe</p>
            <p className="text-2xl font-extrabold text-muted-foreground">{dismissedCount}</p>
          </Card>
        </div>

        {/* Filter Controls */}
        <Card className="bg-card/70 border-border/80 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Status:</span>
            {(["ALL", "PENDING", "ACTION_TAKEN", "DISMISSED"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors cursor-pointer ${
                  statusFilter === st
                    ? "bg-primary text-primary-foreground font-bold"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Reason:</span>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value as any)}
              className="h-8 px-2.5 rounded-lg border border-border/80 bg-background/50 text-xs font-medium text-foreground cursor-pointer"
            >
              <option value="ALL">All Reasons</option>
              <option value="SPAM">Spam</option>
              <option value="HARASSMENT">Harassment</option>
              <option value="SCAM">Scam</option>
              <option value="MISLEADING_CONTENT">Misleading Content</option>
            </select>
          </div>
        </Card>

        {/* Reports Queue List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card className="bg-card/70 border-dashed border-border/80 p-12 text-center space-y-3">
              <CheckCircle className="size-10 text-emerald-400 mx-auto opacity-70" />
              <h3 className="font-bold text-foreground text-base">Moderation Queue is Clean</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No reports matching the selected filters are pending review.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className="bg-card/70 border-border/80 p-5 space-y-3 hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={getReasonBadgeVariant(report.reason)}
                        className="text-[10px] font-mono uppercase"
                      >
                        {report.reason.replace("_", " ")}
                      </Badge>
                      <span className="text-xs font-semibold text-foreground">
                        {report.targetType}: {report.targetTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(report.status)}
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Report details */}
                  <div className="p-3 rounded-lg bg-background/50 border border-border/50 text-xs space-y-1">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Student Explanation: </span>
                      {report.description}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground">
                      Reported by @{report.reporterName}
                    </p>
                  </div>

                  {/* Actions Bar (Flow: Pending -> Review -> Dismiss or Take Action) */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Target ID: {report.targetId}
                    </span>

                    <div className="flex items-center gap-2">
                      {report.status === "PENDING" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDismiss(report.id)}
                            className="text-xs h-7 font-medium"
                          >
                            <Check className="size-3 mr-1" />
                            Dismiss Report
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleTakeAction(report.id)}
                            className="text-xs h-7 font-medium"
                          >
                            <Trash2 className="size-3 mr-1" />
                            Take Action (Remove)
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setReports((prev) =>
                              prev.map((r) =>
                                r.id === report.id ? { ...r, status: "PENDING" } : r
                              )
                            )
                          }
                          className="text-xs h-7 text-muted-foreground hover:text-foreground"
                        >
                          <RotateCcw className="size-3 mr-1" /> Reopen Report
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
