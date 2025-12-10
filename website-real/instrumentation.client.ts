"use client"

import posthog from "posthog-js"

let posthogInitialized = false

const initializePosthog = () => {
  if (posthogInitialized || typeof window === "undefined") {
    return
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn("PostHog key missing; analytics not initialized.")
    }
    return
  }

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    capture_pageleave: true,
    loaded: (posthogInstance) => {
      if (process.env.NODE_ENV === "development") {
        posthogInstance.debug()
      }
    },
    ...( { defaults: "2025-11-30" } as Record<string, unknown> )
  })

  posthogInitialized = true
}

initializePosthog()

export { posthog }
