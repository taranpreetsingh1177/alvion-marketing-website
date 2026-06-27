"use client";

import { createContext, useContext } from "react";

const DARK_SECTION_IDS = new Set(["solution", "services"]);

type SnapContextValue = {
  activeSectionId: string | null;
};

const SnapContext = createContext<SnapContextValue>({ activeSectionId: null });

export function useSnapSection() {
  return useContext(SnapContext);
}

export function isDarkSnapSection(sectionId: string | null) {
  return sectionId !== null && DARK_SECTION_IDS.has(sectionId);
}

export { SnapContext };
