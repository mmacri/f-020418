
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="w-10 h-10 bg-primary flex items-center justify-center rounded">
        <span className="text-primary-foreground font-bold">RE</span>
      </div>
      <div className="ml-2">
        <div className="font-bold text-foreground">Recovery Essentials</div>
        <div className="text-xs text-muted-foreground">Best Recovery Products & Reviews</div>
      </div>
    </Link>
  );
};
