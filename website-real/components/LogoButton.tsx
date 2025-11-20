"use client"

import React, { useContext } from "react"
import { LogoVisibilityContext } from "./ClientRootLayout"
import Link from "next/link"

export default function LogoButton() {
  const { hideLogo } = useContext(LogoVisibilityContext)
  if (hideLogo) return null
  const logoSize = 120
  
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
  top: '4px',
        left: '9px',
        zIndex: 10010,
        display: 'inline-flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: `${logoSize}px`,
        height: `${logoSize}px`,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        outline: 'none',
        borderRadius: '0',
        transition: 'transform 0.25s ease',
        background: 'transparent',
        transformOrigin: 'top left',
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
        width={logoSize}
        height={logoSize}
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: 'top left',
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
