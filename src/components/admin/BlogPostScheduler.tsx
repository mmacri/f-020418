
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BlogPostSchedulerProps {
  published: boolean;
  scheduledDate?: string;
  onSchedule: (date: string) => void;
  onPublish: () => void;
}

const BlogPostScheduler: React.FC<BlogPostSchedulerProps> = ({
  published,
  scheduledDate,
  onSchedule,
  onPublish
}) => {
  const [date, setDate] = useState<Date | undefined>(
    scheduledDate ? new Date(scheduledDate) : undefined
  );
  const [timeHours, setTimeHours] = useState<string>(
    scheduledDate ? format(new Date(scheduledDate), 'HH') : '12'
  );
  const [timeMinutes, setTimeMinutes] = useState<string>(
    scheduledDate ? format(new Date(scheduledDate), 'mm') : '00'
  );

  const handleSchedule = () => {
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    
    const scheduledDateTime = new Date(date);
    scheduledDateTime.setHours(parseInt(timeHours, 10));
    scheduledDateTime.setMinutes(parseInt(timeMinutes, 10));
    
    if (scheduledDateTime < new Date()) {
      toast.error('Cannot schedule for a past date/time');
      return;
    }
    
    onSchedule(scheduledDateTime.toISOString());
    toast.success('Post scheduled successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing Options</CardTitle>
        <CardDescription>
          {published 
            ? 'This post is currently published' 
            : scheduledDate 
              ? `Scheduled to publish on ${format(new Date(scheduledDate), 'PPP')} at ${format(new Date(scheduledDate), 'p')}` 
              : 'Set when this post should be published'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!published && (
          <>
            <div className="flex flex-col space-y-1">
              <label htmlFor="time" className="text-sm font-medium">
                Choose date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex flex-col space-y-1">
              <label htmlFor="time" className="text-sm font-medium">
                Choose time
              </label>
              <div className="flex items-center space-x-2">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={timeHours}
                    onChange={(e) => setTimeHours(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {[...Array(24)].map((_, i) => (
                      <option key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    value={timeMinutes}
                    onChange={(e) => setTimeMinutes(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={(i * 5).toString().padStart(2, '0')}>
                        {(i * 5).toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button 
                onClick={handleSchedule} 
                variant="secondary"
                className="flex-1"
              >
                {scheduledDate ? 'Reschedule' : 'Schedule'}
              </Button>
              <Button 
                onClick={onPublish}
                variant="default"
                className="flex-1"
              >
                Publish Now
              </Button>
            </div>
          </>
        )}
        
        {published && (
          <Button 
            onClick={() => onPublish()} 
            variant="outline"
            className="w-full"
          >
            Unpublish
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogPostScheduler;
