
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const FormActions = ({ isSubmitting, isEditing, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? 'Update' : 'Create'} Product
      </Button>
    </div>
  );
};

export default FormActions;
