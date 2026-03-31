"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const linkClassName =
  "inline-flex h-9 max-w-full items-center gap-1.5 rounded-[11px] border border-gray-200 bg-white/90 px-3 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-xl transition hover:border-gray-300 hover:bg-white";

function BackChevron() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-gray-600"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.08 1.04l-4.25-4a.75.75 0 0 1 0-1.08l4.25-4a.75.75 0 0 1 1.06.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function BackNavLink({
  href,
  children,
  className,
  "aria-label": ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <Link
      href={href}
      className={className ? `${linkClassName} ${className}` : linkClassName}
      aria-label={ariaLabel}
    >
      <BackChevron />
      <span className="truncate">{children}</span>
    </Link>
  );
}
