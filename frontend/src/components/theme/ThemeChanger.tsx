"use client";

import * as React from "react";
import {useTheme} from "next-themes";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Sun, Moon, Laptop} from "lucide-react";

export function ThemeChanger() {
  const {theme, setTheme, resolvedTheme} = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder button with same dimensions to prevent layout shift
    return (
      <div className="rounded-md border-none p-2">
        <div className="w-4 h-4" />
      </div>
    );
  }

  // Always show Sun or Moon depending on resolved theme
  const show = resolvedTheme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-white">
        {show === "light" && <Sun size={20} />}
        {show === "dark" && <Moon size={20} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun /> Light {theme === "light" ? "✓" : ""}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon /> Dark {theme === "dark" ? "✓" : ""}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop /> System {theme === "system" ? "✓" : ""}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
