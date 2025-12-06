import React from "react";

// Footer.jsx
// Simple site footer with brief about text, quick links and
// copyright. Purely presentational — update links as needed.
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">About</h3>
            <p className="text-sm leading-relaxed">
              System Monitor is a real-time OS monitoring tool that displays CPU, memory, disk, and process information with live charts and analytics.
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Features</h3>
            <ul className="text-sm space-y-2">
              <li className="hover:text-blue-400 cursor-pointer transition">
                <a href="#CPU">Real-time CPU monitoring</a>
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                <a href="#CPU">Memory tracking</a>
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                <a href="#processes">Process management</a>
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                <a href="#disk">Disk usage analytics</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-3 text-center">
          <p className="text-sm mb-4 md:mb-0">
            &copy; {currentYear} System Monitor. All rights reserved.
          </p>
        </div>
      </div>
  );
}
