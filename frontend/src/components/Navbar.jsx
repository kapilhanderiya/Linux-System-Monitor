import React from "react";

// Navbar.jsx
// Top navigation bar for quick access to sections of the dashboard.
// Purely presentational; anchors target IDs inside the main page.
export default function Navbar() {
  return (
    <nav className="bg-black/20 sticky top-0 text-white backdrop-blur-lg shadow-lg z-50 border-b border-white/10">
      <div className=" px-8 mx-auto py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">Systrace UI</h1>
        </div>
        <div className="flex items-center space-x-6 text-lg">
          <a href="#CPU" className="hover:scale-110 transition">
            CPU
          </a>
          <a href="#CPU" className="hover:scale-110 transition">
            Memory
          </a>
          <a href="#disk" className="hover:scale-110 transition">
            Disk    
          </a>
          <a href="#processes" className="hover:scale-110 transition">
            Processes
          </a>
        </div>
      </div>
    </nav>
  );
}
