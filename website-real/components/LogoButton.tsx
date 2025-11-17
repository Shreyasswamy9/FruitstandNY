"use client"

import React, { useContext } from "react"
import { LogoVisibilityContext } from "./ClientRootLayout"
import Link from "next/link"

export default function LogoButton() {
  const { hideLogo } = useContext(LogoVisibilityContext)
  if (hideLogo) return null
  
  // On click, clear introPlayed so rotator plays again
  const handleLogoClick = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('introPlayed');
    }
  };
  
  return (
    <Link
      href="/"
      aria-label="Fruitstand home"
      title="Fruitstand"
      onClick={handleLogoClick}
      style={{
        position: 'fixed',
        top: '14px',
        left: '16px',
        zIndex: 10010,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '92px',
        height: '92px',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        outline: 'none',
        borderRadius: '0',
        transition: 'transform 0.25s ease',
        background: 'transparent',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.04)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onFocus={e => {
        e.currentTarget.style.outline = '2px solid rgba(139,92,246,0.6)';
        e.currentTarget.style.outlineOffset = '4px';
      }}
      onBlur={e => {
        e.currentTarget.style.outline = 'none';
        e.currentTarget.style.outlineOffset = '0px';
      }}
    >
      <img
        src="/images/newlogo.png"
        alt="Fruitstand Logo"
        width={92}
        height={92}
        style={{
          width: '92px',
          height: '92px',
          objectFit: 'contain',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
    </Link>
  )
}
