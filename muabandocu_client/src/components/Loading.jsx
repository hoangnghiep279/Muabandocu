import React from "react";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="mb-4 text-lg font-semibold">Đang tải...</p>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default Loading;
