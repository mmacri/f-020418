
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cog, Info, LockKeyhole } from "lucide-react";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
              <Info className="w-5 h-5 mr-2" />
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="admin@recoveryessentials.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="button"
                className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-md w-full hover:bg-indigo-700 transition duration-300"
              >
                Log In
              </button>
            </form>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Admin Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="flex items-center mb-2">
                  <Cog className="mr-2 text-indigo-600" />
                  <h3 className="font-medium">Content Management</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Add, edit, and remove product reviews, categories, and blog posts.
                </p>
              </div>
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="flex items-center mb-2">
                  <LockKeyhole className="mr-2 text-indigo-600" />
                  <h3 className="font-medium">User Management</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Manage admin users, permissions, and access controls.
                </p>
              </div>
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="flex items-center mb-2">
                  <Info className="mr-2 text-indigo-600" />
                  <h3 className="font-medium">Analytics</h3>
                </div>
                <p className="text-sm text-gray-600">
                  View site traffic, click-through rates, and affiliate performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
