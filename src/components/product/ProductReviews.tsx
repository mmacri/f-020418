
import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { isAuthenticated } from '@/services/userService';
import { api } from '@/lib/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful?: number;
}

interface ProductReviewsProps {
  productId: number;
  productSlug: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productSlug }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<string>('recent');
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  // Fetch reviews
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['productReviews', productId, sortOption],
    queryFn: () => api.get<{data: Review[], pagination: any}>(`/products/${productId}/reviews?sort=${sortOption}`),
  });

  // Submit new review
  const submitReviewMutation = useMutation({
    mutationFn: (reviewData: typeof newReview) => {
      return api.post<Review>(`/products/${productId}/reviews`, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
      toast({ 
        title: "Review submitted",
        description: "Thank you for sharing your experience with this product!"
      });
      setNewReview({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
    },
    onError: (error) => {
      toast({ 
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });

  // Helpful review mutation
  const markHelpfulMutation = useMutation({
    mutationFn: (reviewId: number) => {
      return api.post<{helpful: number}>(`/products/${productId}/reviews/${reviewId}/helpful`, {});
    },
    onSuccess: (data, reviewId) => {
      queryClient.setQueryData(['productReviews', productId, sortOption], (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          data: oldData.data.map((review: Review) => 
            review.id === reviewId ? { ...review, helpful: (review.helpful || 0) + 1 } : review
          )
        };
      });
      
      toast({ 
        title: "Thanks for your feedback",
        description: "You marked this review as helpful"
      });
    }
  });

  const toggleReviewExpansion = (reviewId: number) => {
    setExpandedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleRatingChange = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleReviewSubmit = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review",
        variant: "destructive"
      });
      return;
    }

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please provide both a title and comment for your review",
        variant: "destructive"
      });
      return;
    }

    submitReviewMutation.mutate(newReview);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="fill-amber-400 text-amber-400 h-4 w-4" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="text-gray-300 h-4 w-4" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="fill-amber-400 text-amber-400 h-4 w-4" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="text-gray-300 h-4 w-4" />);
      }
    }

    return stars;
  };

  return (
    <div className="product-reviews mt-12">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <select
            className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
        
        <Button 
          onClick={() => setShowReviewForm(!showReviewForm)}
          variant="outline"
        >
          {showReviewForm ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>
      
      {showReviewForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="p-1"
                >
                  <Star className={`h-6 w-6 ${newReview.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="review-title" className="block text-sm font-medium mb-2">Review Title</label>
            <input
              id="review-title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Summarize your experience"
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="review-comment" className="block text-sm font-medium mb-2">Your Review</label>
            <Textarea
              id="review-comment"
              placeholder="What did you like or dislike about this product?"
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            />
          </div>
          
          <Button 
            onClick={handleReviewSubmit}
            disabled={submitReviewMutation.isPending}
          >
            {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      )}
      
      {isLoading ? (
        // Loading skeleton
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-24 mr-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-48 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {reviewsData?.data && reviewsData.data.length > 0 ? (
            <div className="space-y-6">
              {reviewsData.data.map((review) => {
                const isExpanded = expandedReviews.includes(review.id);
                const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                
                return (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="flex mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {reviewDate}
                          </span>
                        </div>
                        
                        <p className="font-semibold mb-2">{review.title}</p>
                        <p className="text-sm text-gray-700 mb-2">
                          by {review.userName}
                        </p>
                        
                        <div className={`text-gray-700 ${isExpanded ? '' : 'line-clamp-3'}`}>
                          {review.comment}
                        </div>
                        
                        {review.comment.length > 150 && (
                          <button 
                            onClick={() => toggleReviewExpansion(review.id)}
                            className="text-sm text-indigo-600 mt-1 flex items-center"
                          >
                            {isExpanded ? (
                              <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                            ) : (
                              <>Read more <ChevronDown className="h-4 w-4 ml-1" /></>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex mt-4 items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markHelpfulMutation.mutate(review.id)}
                        className="text-sm text-gray-500 flex items-center"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful {review.helpful ? `(${review.helpful})` : ''}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm text-gray-500 flex items-center ml-4"
                      >
                        <Flag className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500 mb-4">This product doesn't have any reviews yet.</p>
              <Button onClick={() => setShowReviewForm(true)}>Be the first to review</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductReviews;
