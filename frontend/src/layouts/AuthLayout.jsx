import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl font-bold text-blue-600">
            PropMan Hub
          </Link>
        </div>
        
        {/* This Outlet will render either the LoginPage or RegisterPage */}
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;