
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const ProfileNotFound = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Profile Not Found</AlertTitle>
        <AlertDescription>
          Sorry, this profile doesn't exist or you don't have permission to view it.
        </AlertDescription>
      </Alert>
    </div>
  );
};
