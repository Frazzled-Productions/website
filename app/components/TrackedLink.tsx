'use client';

import { track } from '@vercel/analytics';
import type { ReactNode } from 'react';

type TrackedLinkProps = {
  href: string;
  /** Vercel Analytics custom event name, fired on click. */
  event: string;
  className?: string;
  children: ReactNode;
};

/**
 * An external anchor that records a Vercel Analytics custom event when clicked,
 * so we can see click-throughs in the dashboard. The event name carries the
 * meaning (event-property filtering is a paid feature, event counts are not).
 */
export function TrackedLink({ href, event, className, children }: TrackedLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track(event)}
    >
      {children}
    </a>
  );
}
