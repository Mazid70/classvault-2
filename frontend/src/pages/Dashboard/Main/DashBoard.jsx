import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from './SideBar';

const DashBoard = () => {
  return (
    <main className="flex h-screen overflow-hidden bg-[#0808086f]">
      {/* ===== Sidebar (Fixed) ===== */}
      <aside className="shrink-0">
        <Sidebar />
      </aside>

      {/* ===== Scrollable Content ===== */}
      <section className="flex-1 relative overflow-y-auto overflow-x-hidden min-w-0">
        {/* Background glow */}
        <div className="pointer-events-none z-0 absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-b from-pink-500/10 to-purple-500/10 blur-[120px] -translate-x-1/2 -translate-y-1/2" />

        {/* Content */}
        <div className="relative z-10 w-full px-4 md:px-6 xl:container xl:mx-auto space-y-6">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default DashBoard;
