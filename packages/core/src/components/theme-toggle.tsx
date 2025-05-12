"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggles() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // The active theme is not available on the server.
  // If you have styling that is conditionally applied based on the active-theme,
  // you have to await the mounted state before rendering the active theme.
  useEffect(() => setMounted(true), []);

  const themeMapping: Record<string, string> = {
    light: "Default",
    system: "System",
    "high-contrast": "High Contrast",
  };

  return (
    <div>
      <div className="mt-16 grid grid-flow-col grid-cols-3 grid-rows-2 gap-4">
        {Object.entries(themeMapping).map(([key, value]) => (
          <button
            key={key}
            className={`rounded-md px-4 py-2 font-semibold transition-colors duration-200 ${
              // The theme is only available after the component is mounted.
              mounted && theme == key
                ? "border-primary bg-primary-foreground text-primary border"
                : "bg-primary text-primary-foreground"
            }`}
            onClick={() => {
              setTheme(key);
            }}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
