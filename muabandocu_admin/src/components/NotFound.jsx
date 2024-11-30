import React from "react";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-primaryColor">404</h1>
      <p className="text-3xl mt-4">Page Not Found</p>
      <p className="text-lg mt-2">
        The page you are looking for doesn't exist or an error occurred.
      </p>
      <a
        href="/"
        className="mt-6 px-8 py-3 bg-primaryColor border text-white rounded-lg hover:bg-opacity-90"
      >
        Trở về
      </a>
    </div>
  );
}

export default NotFound;
