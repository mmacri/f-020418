
import React from 'react';
import { CheckCircle } from 'lucide-react';

const HomeWhyChooseUs: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="bg-indigo-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">Why Recovery Essentials?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Honest Reviews</h3>
              <p className="text-gray-600">
                We thoroughly test every product to provide unbiased, detailed reviews you can trust.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Guidance</h3>
              <p className="text-gray-600">
                Our team of fitness professionals provides expert advice to help you select the right tools.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Value for Money</h3>
              <p className="text-gray-600">
                We compare prices and features to ensure you get the best value for your investment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeWhyChooseUs;
