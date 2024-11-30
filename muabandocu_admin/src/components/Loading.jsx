import React from "react";

function Loading({ text }) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        <p className="mt-2">{text}...</p>
      </div>
    </div>
  );
}

export default Loading;
