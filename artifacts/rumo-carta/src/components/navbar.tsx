import { Link } from "wouter";
import { useTheme } from "next-themes";
import { Moon, Sun, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-5xl flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl transition-opacity hover:opacity-80" data-testid="link-home">
          <CarFront className="h-6 w-6" />
          <span>RumoCarta</span>
        </Link>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 bg-muted/50 hover:bg-muted"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
      </div>
    </header>
  );
}