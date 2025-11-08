"use client";
import posthog from "posthog-js";

export default function TrackDemoButton() {
  return (
    <button
      className="rounded bg-black text-white px-3 py-1"
      onClick={() => posthog.capture("demo_click", { where: "home" })}
    >
      Send demo event
    </button>
  );
}

