import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NexLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  showWordmark?: boolean;
  theme?: "white" | "black";
  size?: number;
}

export function NexLogo({
  showWordmark = true,
  theme = "white",
  size = 28,
  className,
  ...props
}: NexLogoProps) {
  const logoSrc = theme === "black" ? "/NexLogoBlack.webp" : "/NexLogoWhite.webp";

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)} {...props}>
      <Image
        src={logoSrc}
        alt="Nex Logo"
        width={size}
        height={size}
        style={{ width: `${size}px`, height: "auto" }}
        className="shrink-0 object-contain"
        priority
      />

      {showWordmark && (
        <span className="font-heading font-bold text-lg sm:text-xl tracking-tight inline-flex items-center gap-1.5">
          <span className="text-foreground">Nex</span>
          <span className="text-primary font-bold">Network</span>
        </span>
      )}
    </div>
  );
}
