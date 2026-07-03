"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { DEFAULT_KIT, getKit, type Kit, type KitId } from "@/lib/checkout"

type KitContextValue = {
  kitId: KitId
  setKitId: (id: KitId) => void
  kit: Kit
}

const KitContext = createContext<KitContextValue | null>(null)

export function KitProvider({ children }: { children: ReactNode }) {
  const [kitId, setKitId] = useState<KitId>(DEFAULT_KIT)
  const kit = getKit(kitId)

  return <KitContext.Provider value={{ kitId, setKitId, kit }}>{children}</KitContext.Provider>
}

export function useKit(): KitContextValue {
  const ctx = useContext(KitContext)
  if (!ctx) {
    throw new Error("useKit deve ser usado dentro de <KitProvider>")
  }
  return ctx
}
