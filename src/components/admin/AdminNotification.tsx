
import React from 'react';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface AdminNotificationProps {
  title: string;
  message: string;
  type: NotificationType;
}

const AdminNotification: React.FC<AdminNotificationProps> = ({ title, message, type }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0">
        {type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
        {type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
        {type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
        {type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-500" />}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export const notify = {
  success: (title: string, message: string) => 
    toast(<AdminNotification title={title} message={message} type="success" />),
  error: (title: string, message: string) => 
    toast(<AdminNotification title={title} message={message} type="error" />),
  info: (title: string, message: string) => 
    toast(<AdminNotification title={title} message={message} type="info" />),
  warning: (title: string, message: string) => 
    toast(<AdminNotification title={title} message={message} type="warning" />)
};

export default AdminNotification;
