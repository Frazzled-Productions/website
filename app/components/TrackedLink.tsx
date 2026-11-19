'use client';

import type { ReactNode } from 'react';
import { sendEvent, type EventName } from '../lib/events';

type TrackedLinkProps = {
  href: string;
  /** Click name counted by the site's own /api/event on click. */
  event: EventName;
  className?: string;
  children: ReactNode;
};

/**
 * An external anchor that adds one to the day's total for its click name when
 * clicked (app/lib/events.ts), so we can see click-throughs without collecting
 * anything about the visitor.
 */
export function TrackedLink({ href, event, className, children }: TrackedLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => sendEvent(event)}
    >
      {children}
    </a>
  );
}
