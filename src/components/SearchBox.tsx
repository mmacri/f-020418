
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  variant?: "full" | "compact";
}

export function SearchBox({ 
  placeholder = "Search products, articles...", 
  className,
  onSearch,
  variant = "full"
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "relative flex items-center",
        {
          "w-full max-w-sm": variant === "full",
          "w-10 transition-all duration-300 ease-in-out": variant === "compact" && !focused,
          "w-full max-w-[200px] md:max-w-[300px]": variant === "compact" && focused
        },
        className
      )}
    >
      {(variant === "full" || focused) && (
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "pl-10 pr-10",
              "h-10 focus-visible:ring-1 focus-visible:ring-ring",
              variant === "compact" && "rounded-full"
            )}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
      
      {variant === "compact" && !focused && (
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10"
          onClick={() => setFocused(true)}
        >
          <Search className="h-5 w-5" />
        </Button>
      )}
    </form>
  );
}
