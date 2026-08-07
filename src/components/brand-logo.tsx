import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  href = "/",
  size = 48,
  showText = false,
}: {
  className?: string;
  href?: string;
  size?: number;
  showText?: boolean;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/brand/enruta-logo.jpg"
        alt="ENRUTA — Descubre tu norte"
        width={size}
        height={size}
        className="rounded-full"
        priority
      />
      {showText ? (
        <span className="flex flex-col leading-tight">
          <span className="font-bold tracking-[0.2em] text-white">ENRUTA</span>
          <span className="text-[10px] tracking-widest text-neon-cyan">
            DESCUBRE TU NORTE
          </span>
        </span>
      ) : null}
    </Link>
  );
}
