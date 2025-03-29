
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">What Our Readers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-md text-card-foreground">
            <div className="flex text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-500" />
              ))}
            </div>
            <p className="text-muted-foreground mb-4">
              "The massage gun recommendation changed my recovery routine completely. I've noticed such a difference in my muscle recovery time!"
            </p>
            <div className="font-semibold">Sarah K. - Runner</div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md text-card-foreground">
            <div className="flex text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-500" />
              ))}
            </div>
            <p className="text-muted-foreground mb-4">
              "I was skeptical about compression gear, but after reading the detailed review, I decided to try it. Now I use it after every workout!"
            </p>
            <div className="font-semibold">Michael T. - Crossfit Athlete</div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md text-card-foreground">
            <div className="flex text-amber-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-500" />
              ))}
            </div>
            <p className="text-muted-foreground mb-4">
              "The product comparison helped me choose the right foam roller for my needs. The detailed breakdown of features was incredibly helpful."
            </p>
            <div className="font-semibold">Lisa M. - Yoga Instructor</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
