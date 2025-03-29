
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';

interface CustomizeSpecsDropdownProps {
  specKeys: string[];
  visibleSpecs: Record<string, boolean>;
  onToggleSpec: (specName: string) => void;
}

const CustomizeSpecsDropdown: React.FC<CustomizeSpecsDropdownProps> = ({ 
  specKeys, 
  visibleSpecs, 
  onToggleSpec 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <ChevronsUpDown className="h-4 w-4 mr-1" /> Customize
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {specKeys.map(spec => (
          <DropdownMenuCheckboxItem
            key={spec}
            checked={visibleSpecs[spec]}
            onCheckedChange={() => onToggleSpec(spec)}
          >
            {spec}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomizeSpecsDropdown;
