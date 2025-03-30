
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  return (
    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md opacity-0 pointer-events-none">
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Theme is light</span>
    </Button>
  );
}
