
import React from 'react';
import { ThumbsUp, Star, CheckCircle } from 'lucide-react';

const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-card-foreground">Why Choose Recovery Essentials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="flex justify-center items-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
              <ThumbsUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Expert Reviews</h3>
            <p className="text-muted-foreground">
              Our team thoroughly tests every product to provide honest, detailed reviews you can trust.
            </p>
          </div>
          
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="flex justify-center items-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Best Products Only</h3>
            <p className="text-muted-foreground">
              We curate only the highest-quality recovery tools to help you achieve optimal results.
            </p>
          </div>
          
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="flex justify-center items-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Recovery Expertise</h3>
            <p className="text-muted-foreground">
              Benefit from our deep knowledge of recovery science to find the tools that will work best for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
