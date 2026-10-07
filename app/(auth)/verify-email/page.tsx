"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck, ArrowRight, RefreshCw } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "your-email@university.edu.ph";
  const [isResending, setIsResending] = React.useState(false);
  const [resendStatus, setResendStatus] = React.useState("");

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendStatus("A new verification link has been sent!");
    }, 600);
  };

  return (
    <Card className="border-border/80 bg-card shadow-xl shadow-black/40 text-center">
      <CardHeader className="space-y-3 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-1">
          <MailCheck className="size-7" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Verify your email
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm max-w-sm">
          We&apos;ve dispatched a confirmation link to:
          <br />
          <span className="text-foreground font-semibold font-mono mt-1 inline-block">
            {email}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {resendStatus && (
          <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            {resendStatus}
          </div>
        )}

        <div className="p-4 rounded-xl bg-secondary/50 border border-border/80 text-left text-xs space-y-1.5 text-muted-foreground">
          <p className="font-semibold text-foreground">Next steps:</p>
          <p>1. Open the confirmation email from Nex Network.</p>
          <p>2. Click the verification link to activate your student badge.</p>
        </div>

        {/* Quick action to simulate verification and proceed to Onboarding */}
        <Button
          onClick={() => router.push("/onboarding")}
          className="w-full font-semibold shadow-md shadow-primary/20"
        >
          Confirm & Continue to Onboarding
          <ArrowRight className="size-4 ml-1" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResend}
          disabled={isResending}
          className="w-full text-xs text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`size-3 mr-1.5 ${isResending ? "animate-spin" : ""}`} />
          {isResending ? "Sending link..." : "Didn't receive email? Resend"}
        </Button>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/60 py-4 text-xs text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Return to Login
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="text-center p-8 text-muted-foreground text-sm">
          Loading verification status...
        </div>
      }
    >
      <VerifyEmailContent />
    </React.Suspense>
  );
}
