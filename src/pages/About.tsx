
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson, PT, DPT",
      role: "Head of Product Testing",
      image: "https://ext.same-assets.com/30303037/team-member-1.jpg",
      bio: "Sarah is a Doctor of Physical Therapy with over 10 years of experience working with athletes. She leads our product testing team and ensures all recommendations are based on sound scientific principles."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Senior Product Reviewer",
      image: "https://ext.same-assets.com/30303038/team-member-2.jpg",
      bio: "A former competitive runner, Michael brings real-world athletic experience to our testing process. He's personally tested over 200 recovery products and specializes in percussion therapy devices."
    },
    {
      id: 3,
      name: "Dr. James Williams",
      role: "Exercise Science Advisor",
      image: "https://ext.same-assets.com/30303039/team-member-3.jpg",
      bio: "With a Ph.D. in Exercise Physiology, Dr. Williams ensures our content reflects the latest research in muscle recovery, performance enhancement, and injury prevention."
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      role: "Content Director",
      image: "https://ext.same-assets.com/30303040/team-member-4.jpg",
      bio: "Emma has over 8 years of experience in health and fitness writing. She oversees our editorial process to ensure all content is accurate, helpful, and easy to understand."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Recovery Essentials</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're on a mission to help you find the best recovery products based on science, not hype.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6">
              Recovery Essentials was founded in 2020 by a team of fitness enthusiasts, physical therapists, and product testers who were frustrated with the lack of honest, thorough recovery product reviews online.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              After spending thousands of dollars on recovery products that didn't live up to their marketing claims, we decided to create a resource that provides science-backed recommendations and honest reviews.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Today, we're proud to help over 500,000 monthly readers find the best recovery tools for their needs. Our team personally tests hundreds of products each year and stays up-to-date on the latest research in recovery science.
            </p>
            <p className="text-lg text-gray-600">
              We're committed to remaining an independent voice in the recovery product space. We never accept payment for positive reviews, and we're transparent about our testing methods and affiliate relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map(member => (
              <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full md:w-1/3 h-48 md:h-auto object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                  <p className="text-indigo-600 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3">Honesty</h3>
                <p className="text-gray-600">
                  We tell it like it is, highlighting both the strengths and limitations of every product we review.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3">Science-Based</h3>
                <p className="text-gray-600">
                  Our recommendations are grounded in scientific research and evidence, not marketing hype.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3">User-Focused</h3>
                <p className="text-gray-600">
                  We prioritize your needs, helping you find the right products for your specific recovery goals and budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
