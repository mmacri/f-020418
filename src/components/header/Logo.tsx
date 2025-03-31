
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const containerSizes = {
    sm: "w-7 h-7",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const logoSize = containerSizes[size];
  const subtitleSize = textSizes[size];

  return (
    <Link to="/" className={cn("flex items-center", className)}>
      <div className={cn("bg-primary flex items-center justify-center rounded", logoSize)}>
        <span className="text-primary-foreground font-bold">RE</span>
      </div>
      <div className="ml-2">
        <div className="font-bold text-foreground">Recovery Essentials</div>
        <div className={cn("text-muted-foreground", subtitleSize)}>Best Recovery Products & Reviews</div>
      </div>
    </Link>
  );
};
