import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // Since we're using light mode only, this component is just a placeholder
  // We'll keep it visible but non-interactive for UI consistency
  return (
    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Theme is light</span>
    </Button>
  );
}
