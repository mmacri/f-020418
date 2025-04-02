
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileErrorAlertProps {
  error: string | null;
  onRetry: () => void;
}

export const ProfileErrorAlert: React.FC<ProfileErrorAlertProps> = ({ error, onRetry }) => {
  if (!error) return null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading profile</AlertTitle>
        <AlertDescription>{error || "Failed to load or create the profile."}</AlertDescription>
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      </Alert>
    </div>
  );
};
