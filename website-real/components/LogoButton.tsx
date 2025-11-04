"use client"

import React, { useContext } from "react"
import { LogoVisibilityContext } from "./ClientRootLayout"

export default function LogoButton() {
  const { hideLogo } = useContext(LogoVisibilityContext)
  if (hideLogo) return null
  // On click, clear introPlayed so rotator plays again
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('introPlayed');
    }
    // Let navigation proceed
  };
  return (
    <a
      href="/"
      aria-label="Home"
      onClick={handleLogoClick}
      style={{
        position: "fixed",
  top: "clamp(0px, 2vw, 8px)",
        left: "clamp(15px, 4vw, 20px)",
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "clamp(100px, 20vw, 140px)",
        height: "clamp(100px, 20vw, 140px)",
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
        src="/images/newlogo.png"
        alt="Fruitstand Logo"
        style={{ width: "100%", height: "100%", objectFit: "contain", border: "none", borderRadius: 0, boxShadow: "none", background: "none", display: "block", pointerEvents: "none" }}
      />
    </a>
  )
}
