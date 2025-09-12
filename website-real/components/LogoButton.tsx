"use client"

import React, { useContext } from "react"
import { LogoVisibilityContext } from "./ClientRootLayout"

export default function LogoButton() {
  const { hideLogo } = useContext(LogoVisibilityContext)
  if (hideLogo) return null
  return (
    <a
      href="/"
      aria-label="Home"
      style={{
        position: "fixed",
  top: "clamp(0px, 2vw, 8px)",
        left: "clamp(15px, 4vw, 20px)",
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "clamp(70px, 16vw, 90px)",
        height: "clamp(70px, 16vw, 90px)",
        background: "none",
        border: "none",
        borderRadius: 0,
        boxShadow: "none",
        cursor: "pointer",
        padding: 0,
        transition: "transform 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onTouchStart={e => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onTouchEnd={e => {
        setTimeout(() => {
          e.currentTarget.style.transform = "scale(1)";
        }, 100);
      }}
    >
      <img
        src="/images/Fruitscale Logo.png"
        alt="Fruitstand Logo"
        style={{ width: "100%", height: "100%", objectFit: "contain", border: "none", borderRadius: 0, boxShadow: "none", background: "none", display: "block", pointerEvents: "none" }}
      />
    </a>
  )
}
