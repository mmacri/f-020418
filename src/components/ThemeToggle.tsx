
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle() {
  // Since we're using light mode only, this component is just a placeholder
  // We'll keep it visible but non-interactive for UI consistency
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
            <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
            <span className="sr-only">Light mode active</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Light mode active</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
