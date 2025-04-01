
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSocialProfile } from "@/hooks/useSocialProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FriendRequestCard } from "@/components/social/FriendRequestCard";
import { ArrowLeft, Users } from "lucide-react";

const FriendRequestsPage = () => {
  const navigate = useNavigate();
  const {
    pendingFriendRequests,
    isLoading,
    respondToFriendRequest
  } = useSocialProfile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-4"
              onClick={() => navigate('/profile')}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Profile
            </Button>
            <h1 className="text-2xl font-bold">Friend Requests</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={18} />
                <span>Pending Friend Requests</span>
              </CardTitle>
              <CardDescription>
                Review and respond to people who want to connect with you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : pendingFriendRequests && pendingFriendRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingFriendRequests.map((request) => (
                    <FriendRequestCard 
                      key={request.id} 
                      request={request} 
                      onRespond={respondToFriendRequest} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No pending requests</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any pending friend requests at the moment
                  </p>
                  <Button onClick={() => navigate('/profile')}>
                    Back to Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FriendRequestsPage;
