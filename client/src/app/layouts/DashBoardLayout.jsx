import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../features/dashboard/ui/components/Sidebar';
import Header from '../../features/dashboard/ui/components/Header';

const DashBoardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, slide-in when open */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:block`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 lg:ml-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
