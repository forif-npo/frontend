import { Moon, Sun } from "@repo/assets/icons/lucide";
import { Button } from "@ui/components/client";
import { useTheme } from "next-themes";
export function ThemeToggles() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "high-contrast") setTheme("light");
    else setTheme("high-contrast");
  };

  return (
    <>
      <Button
        variant="icon"
        size="small"
        onClick={toggleTheme}
        className="text-text-subtle"
      >
        <Moon
          strokeWidth={1.5}
          size={18}
          className="high-contrast:rotate-0 high-contrast:scale-100 high-contrast:block hidden rotate-90 scale-0 transition-all"
        />
        <Sun
          strokeWidth={1.5}
          size={18}
          className="high-contrast:-rotate-90 high-contrast:scale-0 high-contrast:hidden rotate-0 scale-100 transition-all"
        />
      </Button>
    </>
  );
}
