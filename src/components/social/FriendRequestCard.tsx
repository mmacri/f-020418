
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Friendship } from '@/types/social';
import { Check, X, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FriendRequestCardProps {
  request: Friendship;
  onRespond: (requestId: string, accept: boolean) => Promise<any>;
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  onRespond
}) => {
  const [isResponding, setIsResponding] = useState(false);
  
  const handleRespond = async (accept: boolean) => {
    setIsResponding(true);
    try {
      await onRespond(request.id, accept);
    } finally {
      setIsResponding(false);
    }
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage 
                src={request.requestor?.avatar_url || undefined} 
                alt={request.requestor?.display_name || ""} 
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {request.requestor?.display_name?.charAt(0).toUpperCase() || <User size={16} />}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <Link 
                to={`/profile/${request.requestor_id}`} 
                className="font-medium hover:underline"
              >
                {request.requestor?.display_name || "Unknown User"}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRespond(false)}
              disabled={isResponding}
              className="gap-1 border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <X size={14} />
              <span>Decline</span>
            </Button>
            
            <Button
              size="sm"
              onClick={() => handleRespond(true)}
              disabled={isResponding}
              className="gap-1"
            >
              <Check size={14} />
              <span>Accept</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
