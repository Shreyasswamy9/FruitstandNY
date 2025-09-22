"use client"

import React, { createContext, useState } from "react"
import LogoButton from "./LogoButton"
import CartBar from "./CartBar"

// Context to control logo visibility (for intro)
export const LogoVisibilityContext = createContext<{ hideLogo: boolean; setHideLogo: (v: boolean) => void }>({ hideLogo: false, setHideLogo: () => {} })

type ClientRootLayoutProps = {
  children: React.ReactNode
}

export default function ClientRootLayout({ children }: ClientRootLayoutProps) {
  const [hideLogo, setHideLogo] = useState(false)
  return (
    <LogoVisibilityContext.Provider value={{ hideLogo, setHideLogo }}>
      {/* Logo button, visible on every page, picture only, hidden if hideLogo */}
      <LogoButton />
      {children}
      <CartBar />
    </LogoVisibilityContext.Provider>
  )
}