import React, { useContext, useEffect, useState } from 'react';
import {
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaSignOutAlt,
  FaHome,
} from 'react-icons/fa';
import { SiMaterialformkdocs } from 'react-icons/si';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';
import { Link, useLocation } from 'react-router';
import { AuthContext } from '../../../Provider/AuthProvider';
import { MdOutlineInsertPageBreak } from 'react-icons/md';

const Sidebar = () => {
  const location = useLocation();
  const { handleLogout, user } = useContext(AuthContext);

  // 👇 default closed (mobile)
  const [isOpen, setIsOpen] = useState(false);

  // 👇 detect screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false); // mobile always small
      } else {
        setIsOpen(true); // desktop default open
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItemsUser = [
    { title: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { title: 'My Notes', icon: <FaFileAlt />, path: '/dashboard/mymaterials' },
    { title: 'Home', icon: <FaHome />, path: '/' },
    { title: 'All Materials', icon: <SiMaterialformkdocs />, path: '/materials' },
    {
      title: 'Coverpage',
      icon: <MdOutlineInsertPageBreak />,
      path: '/coverpage',
    },
  ];

  const menuItemsAdminCr = [
    { title: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { title: 'All Users', icon: <FaUsers />, path: '/dashboard/users' },
    {
      title: 'Pending Materials',
      icon: <FaFileAlt />,
      path: '/dashboard/pending-materials',
    },
    { title: 'My Materials', icon: <FaFileAlt />, path: '/dashboard/mymaterials' },
    { title: 'Home', icon: <FaHome />, path: '/' },
    { title: 'All Materials', icon: <SiMaterialformkdocs />, path: '/materials' },
    {
      title: 'Coverpage',
      icon: <MdOutlineInsertPageBreak />,
      path: '/coverpage',
    },
  ];

  const menuItems = user?.role === 'student' ? menuItemsUser : menuItemsAdminCr;

  return (
    <aside
      className={`flex flex-col ${
        isOpen ? 'w-64' : 'xl:w-20'
      } bg-[#1a1a1a]/50 backdrop-blur-xl border-r border-white/10 h-screen sticky top-0 transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        {isOpen && (
          <span className="text-white font-extrabold text-xl tracking-wide">
            MyDashboard
          </span>
        )}

        {/* ❌ Toggle hidden on mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:block text-white hover:text-indigo-400 transition text-2xl cursor-pointer"
        >
          {isOpen ? (
            <IoIosArrowDropleftCircle />
          ) : (
            <IoIosArrowDroprightCircle />
          )}
        </button>
      </div>

      {/* Menu */}
      <ul className="flex flex-col mt-4 gap-3">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={index} className="relative">
              <Link
                to={item.path}
                className={`flex items-center gap-4 p-3 mx-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 shadow-lg text-white'
                    : 'text-white hover:bg-white/10 hover:backdrop-blur-md'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {isOpen && <span className="font-medium">{item.title}</span>}
              </Link>

              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 rounded-tr-full rounded-br-full bg-gradient-to-b from-indigo-400 to-purple-500" />
              )}
            </li>
          );
        })}
      </ul>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={`flex items-center gap-2 font-semibold cursor-pointer absolute bottom-10 ${
          isOpen ? 'left-5' : 'left-6 text-2xl'
        }`}
      >
        <FaSignOutAlt />
        {isOpen && 'Logout'}
      </button>
    </aside>
  );
};

export default Sidebar;
