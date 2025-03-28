
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <p className="text-gray-600 mb-4">
            This is a placeholder for the admin dashboard. In a real implementation, this would require authentication and would contain controls for managing the site content.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <p className="font-medium">Access Restricted</p>
            </div>
            <p className="text-sm">
              Please log in with administrator credentials to access the dashboard.
            </p>
          </div>
          
          <div className="mt-6">
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  disabled
                  placeholder="admin@recoveryessentials.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  disabled
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="button"
                disabled
                className="bg-indigo-600 opacity-50 cursor-not-allowed text-white font-medium py-2 px-6 rounded-md w-full"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
