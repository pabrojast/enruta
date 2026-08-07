"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Contenedor de formularios largos en modo lectura clara (form-light).
 * Mantiene la app dark alrededor y enfoca el esfuerzo en escribir.
 */
export function LongFormShell({
  children,
  className,
  title,
  description,
  stepLabel,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  stepLabel?: string;
}) {
  return (
    <div
      className={cn(
        "form-light overflow-hidden rounded-2xl border border-[#d8deea] shadow-[0_12px_40px_rgba(0,0,0,0.22)]",
        className,
      )}
    >
      {(title || description || stepLabel) && (
        <div className="border-b border-[#e4e8f0] bg-white px-5 py-4 sm:px-6">
          {stepLabel ? (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d9488]">
              {stepLabel}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-1 text-lg font-semibold text-[#12141c] sm:text-xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#5b6475]">
              {description}
            </p>
          ) : null}
        </div>
      )}
      <div className="bg-[#f7f8fc] px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[#e4e8f0] bg-white p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      <header className="mb-4 border-b border-[#eef1f6] pb-3">
        <h3 className="text-base font-semibold text-[#12141c]">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-[#5b6475]">
            {description}
          </p>
        ) : null}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function FormField({
  label,
  htmlFor,
  hint,
  optional,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-[#1f2937]"
        >
          {label}
          {optional ? (
            <span className="ml-1.5 text-xs font-normal text-[#7b8494]">
              (opcional)
            </span>
          ) : null}
        </label>
      </div>
      {hint ? (
        <p className="text-xs leading-relaxed text-[#6b7280]">{hint}</p>
      ) : null}
      {children}
    </div>
  );
}

export function FormActions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 -mx-5 mt-2 border-t border-[#e4e8f0] bg-white/95 px-5 py-3 backdrop-blur sm:-mx-6 sm:px-6",
        "supports-[backdrop-filter]:bg-white/90",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
