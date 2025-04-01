
import React from "react";
import { User } from "@/services/userService";
import { ShieldCheck } from "lucide-react";

interface RoleInformationProps {
  user: User;
}

const RoleInformation: React.FC<RoleInformationProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-2 p-3 rounded-md bg-primary/10">
      <ShieldCheck className="h-5 w-5 text-primary" />
      <div>
        <p className="font-medium text-primary">
          {user.role === "admin" ? "Administrator" : 
          user.role === "editor" ? "Editor" : "Regular User"}
        </p>
        <p className="text-sm text-muted-foreground">
          {user.role === "admin" ? "Full access to all areas of the platform." : 
          user.role === "editor" ? "Can manage content but not system settings." : 
          "Limited access to platform features."}
        </p>
      </div>
    </div>
  );
};

export default RoleInformation;
