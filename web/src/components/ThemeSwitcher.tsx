"use client";

import { useTheme } from "./providers/ThemeProvider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Moon, Sun, Monitor, Check } from "lucide-react";

type Theme = "light" | "dark" | "system";

const themeNames: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const themeIcons: Record<Theme, React.ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes: Theme[] = ["light", "dark", "system"];

  const getCurrentIcon = () => {
    const Icon = themeIcons[theme as Theme] || Monitor;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {getCurrentIcon()}
          <span className="hidden sm:inline">{themeNames[theme as Theme]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => {
          const Icon = themeIcons[themeOption];
          return (
            <DropdownMenuItem
              key={themeOption}
              onClick={() => setTheme(themeOption)}
              className="gap-2 cursor-pointer"
            >
              <Icon className="h-4 w-4" />
              <span>{themeNames[themeOption]}</span>
              {theme === themeOption && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
