"use client";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

type Props = { children: React.ReactNode; userId?: string; email?: string | null };

export default function PostHogProvider({ children, userId, email }: Props) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    // init once
    // @ts-expect-error: private flag to detect init
    if (!posthog.__INIT) {
      posthog.init(key, { api_host: host, capture_pageview: true, autocapture: true });
      // @ts-expect-error
      posthog.__INIT = true;
    }

    // Identify (optional — anonymous works too)
    if (userId || email) posthog.identify(userId || email!, { email: email || undefined });
  }, [userId, email]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

