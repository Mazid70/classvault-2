import React from 'react';
import { FaHome } from 'react-icons/fa';
import {
  MdDashboard,
  MdLeaderboard,
  MdOutlineInsertPageBreak,
} from 'react-icons/md';
import { SiMaterialformkdocs } from 'react-icons/si';
import { useLocation, useNavigate } from 'react-router';

const BottomMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItem = [
    {
      title: 'Home',
      icon: <FaHome />,
      path: '/',
    },
    {
      title: 'Coverpage',
      icon: <MdOutlineInsertPageBreak />,
      path: '/coverpage',
    },
    {
      title: 'Materials',
      icon: <SiMaterialformkdocs />,
      path: '/materials',
    },
    {
      title: 'Leaderboard',
      icon: <MdLeaderboard />,
      path: '/leaderboard',
    },
    {
      title: 'Dashboard',
      icon: <MdDashboard />,
      path: '/dashboard',
    },
  ];

  return (
    <main className="fixed md:hidden bottom-0 w-full bg-[#1F1C1E]  border-t border-gray-700 z-50">
      <div className="flex justify-around items-center h-14">
        {menuItem.map((item, idx) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center text-xs transition-all
                ${
                  isActive ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mt-1">{item.title}</span>
            </button>
          );
        })}
      </div>
    </main>
  );
};

export default BottomMenu;
